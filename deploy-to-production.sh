#!/bin/bash

#############################################
# DataPulse Human Services - Production Deployment
# Purpose: Deploy React + Express app to datapulseai.co
# Domain: datapulseai.co
#############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="datapulseai.co"
WWW_DOMAIN="www.datapulseai.co"
PROJECT_DIR="/home/calvin/Websites/DataPulse Human Website/DataPulse-Human-Services"
DEPLOY_DIR="/srv/http/datapulseai"
NGINX_SITE="datapulseai"
PM2_APP="datapulseai-backend"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}${1}${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run with sudo"
        print_info "Usage: sudo bash deploy-to-production.sh"
        exit 1
    fi
}

# Step 1: Stop running development servers
stop_dev_servers() {
    print_section "Step 1: Stop Development Servers"

    print_info "Checking for running development servers..."

    # Check if dev servers are running on ports 3000, 3001, 5000
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Development server running on port 3000"
        print_info "You may want to stop it manually if needed"
    fi

    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Development server running on port 3001"
        print_info "You may want to stop it manually if needed"
    fi

    if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Service running on port 5000"
        print_info "Will be replaced by production backend"
    fi

    print_success "Development server check complete"
}

# Step 2: Build React frontend
build_frontend() {
    print_section "Step 2: Build React Frontend"

    print_info "Switching to client directory..."
    cd "${PROJECT_DIR}/client"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        sudo -u calvin npm ci
    fi

    print_info "Building React application for production..."
    sudo -u calvin npm run build

    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not created"
        exit 1
    fi

    print_success "Frontend build completed"
    print_info "Build location: ${PROJECT_DIR}/client/dist"
}

# Step 3: Prepare backend
prepare_backend() {
    print_section "Step 3: Prepare Backend"

    print_info "Switching to server directory..."
    cd "${PROJECT_DIR}/server"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing backend dependencies..."
        cd "${PROJECT_DIR}"
        sudo -u calvin npm ci
    fi

    print_success "Backend preparation completed"
}

# Step 4: Create deployment directory
create_deploy_dir() {
    print_section "Step 4: Create Deployment Directory"

    if [ -d "${DEPLOY_DIR}" ]; then
        print_warning "Deployment directory exists, creating backup..."
        BACKUP_DIR="${DEPLOY_DIR}-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r "${DEPLOY_DIR}" "${BACKUP_DIR}"
        print_success "Backup created: ${BACKUP_DIR}"
    fi

    print_info "Creating deployment directory structure..."
    mkdir -p "${DEPLOY_DIR}"
    mkdir -p "${DEPLOY_DIR}/client/dist"
    mkdir -p "${DEPLOY_DIR}/server"
    mkdir -p /var/log/pm2

    print_success "Deployment directories created"
}

# Step 5: Deploy files
deploy_files() {
    print_section "Step 5: Deploy Files"

    print_info "Deploying frontend build..."
    cp -r "${PROJECT_DIR}/client/dist/"* "${DEPLOY_DIR}/client/dist/"
    print_success "Frontend deployed to: ${DEPLOY_DIR}/client/dist/"

    print_info "Deploying backend files..."
    # Copy server files
    cp -r "${PROJECT_DIR}/server/"* "${DEPLOY_DIR}/server/" 2>/dev/null || true

    # Copy root-level files needed for backend
    cp "${PROJECT_DIR}/package.json" "${DEPLOY_DIR}/" 2>/dev/null || true
    cp "${PROJECT_DIR}/package-lock.json" "${DEPLOY_DIR}/" 2>/dev/null || true

    # Copy node_modules for backend
    print_info "Copying backend dependencies..."
    if [ -d "${PROJECT_DIR}/node_modules" ]; then
        cp -r "${PROJECT_DIR}/node_modules" "${DEPLOY_DIR}/"
    fi

    print_success "Backend deployed to: ${DEPLOY_DIR}/server/"

    print_info "Deploying environment file..."
    if [ -f "${PROJECT_DIR}/.env" ]; then
        cp "${PROJECT_DIR}/.env" "${DEPLOY_DIR}/"
        print_success "Environment file deployed"
    else
        print_warning "No .env file found - email functionality may not work"
        print_info "Create .env file with EMAIL_* variables in ${DEPLOY_DIR}/"
    fi

    # Copy ecosystem config
    print_info "Deploying PM2 configuration..."
    cp "${PROJECT_DIR}/ecosystem.config.js" "${DEPLOY_DIR}/"
    print_success "PM2 config deployed"

    # Fix permissions
    print_info "Setting correct permissions..."
    chown -R calvin:calvin "${DEPLOY_DIR}"
    chmod -R 755 "${DEPLOY_DIR}"

    # Protect .env file
    if [ -f "${DEPLOY_DIR}/.env" ]; then
        chmod 600 "${DEPLOY_DIR}/.env"
    fi

    print_success "All files deployed successfully"
}

# Step 6: Configure nginx
configure_nginx() {
    print_section "Step 6: Configure Nginx"

    print_info "Backing up current nginx configuration..."
    if [ -f "/etc/nginx/sites-available/${NGINX_SITE}" ]; then
        BACKUP_FILE="/etc/nginx/sites-available/${NGINX_SITE}.backup-$(date +%Y%m%d-%H%M%S)"
        cp "/etc/nginx/sites-available/${NGINX_SITE}" "${BACKUP_FILE}"
        print_success "Backup created: ${BACKUP_FILE}"
    fi

    print_info "Installing new nginx configuration..."
    cp "${PROJECT_DIR}/nginx-datapulseai.conf" "/etc/nginx/sites-available/${NGINX_SITE}"
    print_success "Nginx configuration installed"

    # Enable site if not already enabled
    if [ ! -L "/etc/nginx/sites-enabled/${NGINX_SITE}" ]; then
        print_info "Enabling nginx site..."
        ln -sf "/etc/nginx/sites-available/${NGINX_SITE}" "/etc/nginx/sites-enabled/${NGINX_SITE}"
        print_success "Nginx site enabled"
    fi

    # Test configuration
    print_info "Testing nginx configuration..."
    if nginx -t 2>&1 | grep -q "test is successful"; then
        print_success "Nginx configuration is valid"
    else
        print_error "Nginx configuration test failed!"
        nginx -t
        print_warning "Restoring backup..."
        if [ ! -z "${BACKUP_FILE}" ] && [ -f "${BACKUP_FILE}" ]; then
            cp "${BACKUP_FILE}" "/etc/nginx/sites-available/${NGINX_SITE}"
            print_info "Backup restored"
        fi
        exit 1
    fi

    print_info "Reloading nginx..."
    systemctl reload nginx
    print_success "Nginx reloaded"
}

# Step 7: Stop old PM2 processes
stop_old_pm2() {
    print_section "Step 7: Stop Old PM2 Processes"

    print_info "Checking for existing PM2 processes..."

    # Stop old datapulseai process if exists
    if sudo -u calvin pm2 describe datapulseai &>/dev/null; then
        print_info "Stopping old 'datapulseai' process..."
        sudo -u calvin pm2 delete datapulseai
        print_success "Old process stopped"
    fi

    # Stop datapulseai-backend if exists
    if sudo -u calvin pm2 describe ${PM2_APP} &>/dev/null; then
        print_info "Stopping '${PM2_APP}' process..."
        sudo -u calvin pm2 delete ${PM2_APP}
        print_success "Process stopped"
    fi

    print_success "Old PM2 processes cleaned up"
}

# Step 8: Start backend with PM2
start_backend() {
    print_section "Step 8: Start Backend Server"

    print_info "Starting Express backend with PM2..."
    cd "${DEPLOY_DIR}"

    sudo -u calvin pm2 start ecosystem.config.js --env production

    # Wait for startup
    sleep 3

    # Check status
    if sudo -u calvin pm2 list | grep -q "${PM2_APP}.*online"; then
        print_success "Backend started successfully"
        sudo -u calvin pm2 save
        print_success "PM2 configuration saved"
    else
        print_error "Backend failed to start"
        print_info "Checking logs..."
        sudo -u calvin pm2 logs ${PM2_APP} --lines 20 --nostream
        exit 1
    fi

    # Display status
    sudo -u calvin pm2 status ${PM2_APP}
}

# Step 9: Verify deployment
verify_deployment() {
    print_section "Step 9: Verify Deployment"

    # Wait a moment for everything to stabilize
    sleep 2

    print_info "Checking backend health..."
    if curl -s -f http://localhost:5000/api/health >/dev/null 2>&1; then
        print_success "Backend API is responding"
    else
        print_warning "Backend API health check failed"
        print_info "This might be normal if /api/health endpoint doesn't exist"
    fi

    print_info "Checking nginx status..."
    if systemctl is-active --quiet nginx; then
        print_success "Nginx is running"
    else
        print_error "Nginx is not running!"
        systemctl status nginx
        exit 1
    fi

    print_info "Checking PM2 process..."
    if sudo -u calvin pm2 list | grep -q "${PM2_APP}.*online"; then
        print_success "PM2 backend is running"
    else
        print_error "PM2 backend is not running!"
        sudo -u calvin pm2 list
        exit 1
    fi

    print_info "Checking SSL certificate..."
    CERT_CHECK=$(echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>&1 | grep "subject=" | head -1)
    if echo "$CERT_CHECK" | grep -q "${DOMAIN}"; then
        print_success "SSL certificate is valid for ${DOMAIN}"
    else
        print_warning "SSL certificate check: ${CERT_CHECK}"
    fi

    print_info "Testing HTTPS endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/ 2>&1)
    if [[ "$HTTP_CODE" =~ ^(200|301|302)$ ]]; then
        print_success "HTTPS is responding (HTTP ${HTTP_CODE})"
    else
        print_warning "HTTPS returned HTTP ${HTTP_CODE}"
    fi

    print_success "Deployment verification complete"
}

# Main execution
main() {
    print_section "DataPulse Human Services - Production Deployment"

    check_sudo

    echo ""
    print_info "This script will deploy to: ${DOMAIN}"
    print_info "Deployment directory: ${DEPLOY_DIR}"
    echo ""
    print_info "Steps:"
    echo "  1. Stop development servers"
    echo "  2. Build React frontend"
    echo "  3. Prepare backend"
    echo "  4. Create deployment directory"
    echo "  5. Deploy files"
    echo "  6. Configure nginx"
    echo "  7. Stop old PM2 processes"
    echo "  8. Start backend with PM2"
    echo "  9. Verify deployment"
    echo ""

    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi

    stop_dev_servers
    build_frontend
    prepare_backend
    create_deploy_dir
    deploy_files
    configure_nginx
    stop_old_pm2
    start_backend
    verify_deployment

    print_section "Deployment Complete!"
    print_success "DataPulse Human Services is now live at https://${DOMAIN}"
    echo ""
    print_info "URLs:"
    echo "  • Frontend: https://${DOMAIN}"
    echo "  • API: https://${DOMAIN}/api/"
    echo "  • Contact Form: https://${DOMAIN}/contact"
    echo ""
    print_info "Useful commands:"
    echo "  • Check backend: pm2 status ${PM2_APP}"
    echo "  • View logs: pm2 logs ${PM2_APP}"
    echo "  • Restart backend: pm2 restart ${PM2_APP}"
    echo "  • Nginx logs: sudo tail -f /var/log/nginx/datapulseai-error.log"
    echo "  • Test site: curl -I https://${DOMAIN}"
    echo ""
    print_info "Features deployed:"
    echo "  ✓ React frontend with SEO optimization"
    echo "  ✓ Contact form with email functionality"
    echo "  ✓ Express API backend"
    echo "  ✓ HTTPS with Let's Encrypt"
    echo "  ✓ Security headers configured"
    echo ""
}

# Run main function
main "$@"
