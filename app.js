// Stock Tutor CRM Login and Dashboard Application
class StockTutorCRM {
    constructor() {
        this.userData = null;
        this.appData = {
            users: [
                {
                    email: "admin@stocktutor.com",
                    password: "Admin@123",
                    name: "Admin User",
                    role: "Administrator",
                    permissions: ["dashboard", "leads", "pipeline", "webinars", "analytics", "customers", "support", "tasks", "settings", "import"]
                },
                {
                    email: "manager@stocktutor.com", 
                    password: "Manager@123",
                    name: "Sales Manager",
                    role: "Sales Manager",
                    permissions: ["dashboard", "leads", "pipeline", "webinars", "analytics", "import"]
                },
                {
                    email: "rep@stocktutor.com",
                    password: "Rep@123", 
                    name: "Sales Rep",
                    role: "Sales Representative",
                    permissions: ["dashboard", "leads", "pipeline"]
                },
                {
                    email: "marketing@stocktutor.com",
                    password: "Marketing@123",
                    name: "Marketing Specialist", 
                    role: "Marketing Specialist",
                    permissions: ["dashboard", "webinars", "import", "analytics"]
                },
                {
                    email: "support@stocktutor.com",
                    password: "Support@123",
                    name: "Support Rep",
                    role: "Support Representative", 
                    permissions: ["dashboard", "customers", "support", "tasks"]
                }
            ],
            leads: [
                {
                    id: "L001",
                    name: "Raj Sharma", 
                    email: "raj.sharma@gmail.com",
                    phone: "+91-9876543210",
                    company: "TechCorp",
                    source: "Meta Ads - Facebook",
                    status: "New Lead",
                    webinarRegistered: false,
                    webinarAttended: false,
                    leadScore: 65,
                    dateCreated: "2025-06-10",
                    assignedTo: "Sales Rep",
                    lastContact: "2025-06-10",
                    courseInterest: "Stock Trading Basics",
                    priority: "Medium"
                },
                {
                    id: "L002", 
                    name: "Priya Patel",
                    email: "priya.patel@yahoo.com",
                    phone: "+91-8765432109", 
                    company: "Freelancer",
                    source: "Meta Ads - Instagram",
                    status: "Webinar Attended",
                    webinarRegistered: true,
                    webinarAttended: true,
                    leadScore: 85,
                    dateCreated: "2025-06-08",
                    assignedTo: "Sales Manager",
                    lastContact: "2025-06-11",
                    courseInterest: "Advanced Options Trading",
                    priority: "High"
                }
            ],
            webinars: [
                {
                    id: "W001",
                    title: "Stock Market Basics for Beginners",
                    date: "2025-06-20",
                    time: "7:00 PM IST",
                    registrations: 245,
                    attendees: 187,
                    status: "Upcoming"
                },
                {
                    id: "W002",
                    title: "Advanced Trading Strategies", 
                    date: "2025-06-15",
                    time: "7:00 PM IST",
                    registrations: 189,
                    attendees: 142,
                    status: "Completed"
                }
            ],
            deals: [
                {
                    id: "D001",
                    leadId: "L002",
                    customerName: "Priya Patel",
                    course: "Advanced Options Trading",
                    value: 12999,
                    stage: "Demo/Consultation",
                    probability: 75,
                    expectedCloseDate: "2025-06-25",
                    assignedTo: "Sales Manager"
                }
            ]
        };

        this.loginElements = {
            loginView: document.getElementById('login-view'),
            form: document.getElementById('loginForm'),
            emailInput: document.getElementById('email'),
            passwordInput: document.getElementById('password'),
            passwordToggle: document.querySelector('.password-toggle'),
            rememberCheckbox: document.getElementById('remember'),
            submitButton: document.querySelector('.sign-in-btn'),
            formMessage: document.getElementById('form-message'),
            capsLockWarning: document.getElementById('caps-lock-warning'),
            emailError: document.getElementById('email-error'),
            passwordError: document.getElementById('password-error')
        };

        this.crmElements = {
            crmView: document.getElementById('crm-view'),
            userName: document.getElementById('user-name'),
            userRole: document.getElementById('user-role'),
            logoutBtn: document.getElementById('logout-btn'),
            navMenu: document.getElementById('nav-menu'),
            navItems: document.querySelectorAll('.nav-item'),
            contentSections: document.querySelectorAll('.content-section'),
            leadsTable: document.getElementById('leads-table'),
            pipelineDeals: document.getElementById('pipeline-deals'),
            webinarsList: document.getElementById('webinars-list'),
            totalLeads: document.getElementById('total-leads'),
            activeDeals: document.getElementById('active-deals'),
            webinarRegistrations: document.getElementById('webinar-registrations'),
            totalRevenue: document.getElementById('total-revenue'),
            recentActivity: document.getElementById('recent-activity-list')
        };
        
        this.isSubmitting = false;
        this.capsLockOn = false;
        
        this.init();
    }
    
    init() {
        // Check if user is already logged in
        this.checkSession();
        
        // Set up login form event listeners
        this.setupLoginFormListeners();
        
        // Set up CRM dashboard event listeners
        this.setupCRMEventListeners();
    }

    checkSession() {
        // Check for authenticated session
        const userSession = sessionStorage.getItem('stockTutorAuthUser');
        if (userSession) {
            try {
                this.userData = JSON.parse(userSession);
                this.showCRMDashboard();
            } catch (error) {
                console.error('Error parsing user session:', error);
                sessionStorage.removeItem('stockTutorAuthUser');
            }
        }
    }
    
    setupLoginFormListeners() {
        const { form, emailInput, passwordInput, passwordToggle, 
                capsLockWarning, rememberCheckbox } = this.loginElements;
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Password toggle
        passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        
        // Real-time validation
        emailInput.addEventListener('input', () => this.validateEmail());
        emailInput.addEventListener('blur', () => this.validateEmail());
        passwordInput.addEventListener('input', () => this.validatePassword());
        passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Caps Lock detection
        passwordInput.addEventListener('keydown', (e) => this.detectCapsLock(e));
        passwordInput.addEventListener('keyup', (e) => this.detectCapsLock(e));
        passwordInput.addEventListener('focus', () => this.checkCapsLock());
        passwordInput.addEventListener('blur', () => this.hideCapsLockWarning());
        
        // Input field focus effects
        this.setupInputFocusEffects();
        
        // Forgot password link
        document.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.showMessage('Password reset functionality will be available soon.', 'info');
        });

        // Load remembered email if exists
        this.loadRememberedEmail();
    }
    
    setupCRMEventListeners() {
        const { logoutBtn, navItems } = this.crmElements;
        
        // Logout button
        logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Navigation items
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });
    }
    
    setupInputFocusEffects() {
        const { emailInput, passwordInput } = this.loginElements;
        const inputs = [emailInput, passwordInput];
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }
    
    togglePasswordVisibility() {
        const { passwordInput, passwordToggle } = this.loginElements;
        const eyeIcon = passwordToggle.querySelector('.eye-icon');
        const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
            passwordToggle.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
            passwordToggle.setAttribute('aria-label', 'Show password');
        }
    }
    
    validateEmail() {
        const { emailInput, emailError } = this.loginElements;
        const email = emailInput.value.trim();
        
        // Clear previous states
        emailInput.classList.remove('error', 'success');
        emailError.classList.remove('show');
        
        if (!email) {
            if (emailInput === document.activeElement) {
                return; // Don't show error while typing
            }
            this.showFieldError('email', 'Email address is required');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            return false;
        }
        
        emailInput.classList.add('success');
        return true;
    }
    
    validatePassword() {
        const { passwordInput, passwordError } = this.loginElements;
        const password = passwordInput.value;
        
        // Clear previous states
        passwordInput.classList.remove('error', 'success');
        passwordError.classList.remove('show');
        
        if (!password) {
            if (passwordInput === document.activeElement) {
                return; // Don't show error while typing
            }
            this.showFieldError('password', 'Password is required');
            return false;
        }
        
        passwordInput.classList.add('success');
        return true;
    }
    
    showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    detectCapsLock(event) {
        // Detect Caps Lock
        if (event.getModifierState) {
            this.capsLockOn = event.getModifierState('CapsLock');
        }
        this.updateCapsLockWarning();
    }
    
    checkCapsLock() {
        // This is called on focus - we'll update when user types
    }
    
    updateCapsLockWarning() {
        const { capsLockWarning, passwordInput } = this.loginElements;
        
        if (this.capsLockOn && passwordInput === document.activeElement) {
            capsLockWarning.classList.remove('hidden');
            capsLockWarning.classList.add('show');
        } else {
            this.hideCapsLockWarning();
        }
    }
    
    hideCapsLockWarning() {
        const { capsLockWarning } = this.loginElements;
        
        capsLockWarning.classList.remove('show');
        setTimeout(() => {
            if (!capsLockWarning.classList.contains('show')) {
                capsLockWarning.classList.add('hidden');
            }
        }, 250);
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        const { emailInput, passwordInput, rememberCheckbox } = this.loginElements;
        
        // Validate all fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showMessage('Please fix the errors above and try again.', 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.showLoadingState();
        
        // Save email if remember me is checked
        if (rememberCheckbox.checked) {
            this.saveRememberedEmail();
        } else {
            this.clearRememberedEmail();
        }
        
        try {
            // Authenticate user
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.userData = user;
                
                // Save session
                sessionStorage.setItem('stockTutorAuthUser', JSON.stringify(this.userData));
                
                this.showMessage(`Login successful! Welcome, ${user.name}!`, 'success');
                
                // Show dashboard after short delay
                setTimeout(() => {
                    this.showCRMDashboard();
                }, 1000);
            } else {
                throw new Error('Invalid email or password. Please check your credentials and try again.');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }
    
    authenticateUser(email, password) {
        // Find user with matching email and password
        return this.appData.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }
    
    showLoadingState() {
        const { submitButton } = this.loginElements;
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        const btnText = submitButton.querySelector('.btn-text');
        const spinner = submitButton.querySelector('.loading-spinner');
        
        btnText.style.opacity = '0';
        spinner.classList.remove('hidden');
    }
    
    hideLoadingState() {
        const { submitButton } = this.loginElements;
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        const btnText = submitButton.querySelector('.btn-text');
        const spinner = submitButton.querySelector('.loading-spinner');
        
        btnText.style.opacity = '1';
        spinner.classList.add('hidden');
    }
    
    showMessage(message, type) {
        const { formMessage } = this.loginElements;
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        formMessage.classList.add(type, 'show');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage();
            }, 5000);
        }
    }
    
    hideMessage() {
        const { formMessage } = this.loginElements;
        formMessage.classList.remove('show');
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 250);
    }
    
    saveRememberedEmail() {
        const { emailInput } = this.loginElements;
        const email = emailInput.value.trim();
        if (email && this.isValidEmail(email)) {
            sessionStorage.setItem('rememberedEmail', email);
        }
    }
    
    clearRememberedEmail() {
        sessionStorage.removeItem('rememberedEmail');
    }
    
    loadRememberedEmail() {
        const { emailInput, rememberCheckbox } = this.loginElements;
        const rememberedEmail = sessionStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }
    
    showCRMDashboard() {
        const { loginView } = this.loginElements;
        const { crmView, userName, userRole } = this.crmElements;
        
        // Hide login, show CRM
        loginView.classList.add('hidden');
        crmView.classList.remove('hidden');
        
        // Set user info
        userName.textContent = this.userData.name;
        userRole.textContent = this.userData.role;
        
        // Setup navigation based on permissions
        this.setupNavigation();
        
        // Load dashboard data
        this.loadDashboardData();
        
        // Show dashboard section by default
        this.navigateToSection('dashboard');
    }
    
    setupNavigation() {
        const { navItems } = this.crmElements;
        const permissions = this.userData.permissions;
        
        // Show/hide nav items based on permissions
        navItems.forEach(item => {
            const permission = item.dataset.permission;
            if (permissions.includes(permission)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    handleLogout() {
        // Clear user session
        sessionStorage.removeItem('stockTutorAuthUser');
        this.userData = null;
        
        const { loginView, emailInput, passwordInput } = this.loginElements;
        const { crmView } = this.crmElements;
        
        // Show login, hide CRM
        loginView.classList.remove('hidden');
        crmView.classList.add('hidden');
        
        // Clear password
        passwordInput.value = '';
        
        // Reset form validation
        emailInput.classList.remove('success', 'error');
        passwordInput.classList.remove('success', 'error');
    }
    
    navigateToSection(sectionId) {
        const { navItems, contentSections } = this.crmElements;
        
        // Highlight active nav item
        navItems.forEach(item => {
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show active section, hide others
        contentSections.forEach(section => {
            if (section.id === `${sectionId}-section`) {
                section.classList.remove('hidden');
                
                // Load section data if needed
                this.loadSectionData(sectionId);
            } else {
                section.classList.add('hidden');
            }
        });
    }
    
    loadDashboardData() {
        const { totalLeads, activeDeals, webinarRegistrations, totalRevenue, recentActivity } = this.crmElements;
        
        // Set dashboard metrics
        totalLeads.textContent = this.appData.leads.length;
        activeDeals.textContent = this.appData.deals.length;
        
        let totalRegistrations = 0;
        this.appData.webinars.forEach(webinar => totalRegistrations += webinar.registrations);
        webinarRegistrations.textContent = totalRegistrations;
        
        // Calculate total revenue from deals
        let revenue = 0;
        this.appData.deals.forEach(deal => revenue += deal.value);
        totalRevenue.textContent = `₹${revenue.toLocaleString('en-IN')}`;
        
        // Generate recent activity items
        recentActivity.innerHTML = '';
        
        // Add recent activities
        const activities = [
            { text: '<strong>Priya Patel</strong> registered for webinar "Advanced Trading Strategies"', time: '10 minutes ago' },
            { text: '<strong>Sales Manager</strong> created a new deal worth <strong>₹12,999</strong>', time: '2 hours ago' },
            { text: '<strong>System</strong> imported 12 new leads from Facebook Campaign', time: '3 hours ago' },
            { text: '<strong>Raj Sharma</strong> was added as a new lead', time: '1 day ago' }
        ];
        
        activities.forEach(activity => {
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-item';
            activityEl.innerHTML = `
                ${activity.text}
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                    ${activity.time}
                </div>
            `;
            recentActivity.appendChild(activityEl);
        });
    }
    
    loadSectionData(section) {
        switch(section) {
            case 'leads':
                this.loadLeadsData();
                break;
            case 'pipeline':
                this.loadPipelineData();
                break;
            case 'webinars':
                this.loadWebinarsData();
                break;
        }
    }
    
    loadLeadsData() {
        const { leadsTable } = this.crmElements;
        
        // Filter leads based on user role
        let displayLeads = this.appData.leads;
        
        if (this.userData.role === "Sales Representative") {
            // Filter leads assigned to this rep only
            displayLeads = displayLeads.filter(lead => lead.assignedTo === "Sales Rep");
        }
        
        // Create HTML table
        leadsTable.innerHTML = `
            <table class="leads-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Lead Score</th>
                        <th>Course Interest</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    ${displayLeads.map(lead => `
                        <tr>
                            <td>${lead.name}</td>
                            <td>${lead.email}</td>
                            <td>${lead.phone}</td>
                            <td>${lead.status}</td>
                            <td>${lead.leadScore}</td>
                            <td>${lead.courseInterest}</td>
                            <td>${lead.assignedTo}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    loadPipelineData() {
        const { pipelineDeals } = this.crmElements;
        
        // Filter deals based on user role
        let displayDeals = this.appData.deals;
        
        if (this.userData.role === "Sales Representative") {
            // Filter deals assigned to this rep only
            displayDeals = displayDeals.filter(deal => deal.assignedTo === "Sales Rep");
        }
        
        // Clear existing deals
        pipelineDeals.innerHTML = '';
        
        // Display deals
        displayDeals.forEach(deal => {
            const dealCard = document.createElement('div');
            dealCard.className = 'deal-card';
            dealCard.innerHTML = `
                <div class="deal-header">
                    <div class="deal-customer">${deal.customerName}</div>
                    <div class="deal-value">₹${deal.value.toLocaleString('en-IN')}</div>
                </div>
                <div class="deal-course">${deal.course}</div>
                <div class="deal-stage">
                    <span class="status status--info">${deal.stage}</span>
                </div>
                <div class="deal-probability">
                    Probability: ${deal.probability}% • Closing: ${deal.expectedCloseDate}
                </div>
            `;
            
            pipelineDeals.appendChild(dealCard);
        });
    }
    
    loadWebinarsData() {
        const { webinarsList } = this.crmElements;
        
        // Clear existing webinars
        webinarsList.innerHTML = '';
        
        // Display webinars
        this.appData.webinars.forEach(webinar => {
            const webinarCard = document.createElement('div');
            webinarCard.className = 'webinar-card';
            
            // Determine status class
            let statusClass = 'status--info';
            if (webinar.status === 'Upcoming') {
                statusClass = 'status--success';
            } else if (webinar.status === 'Completed') {
                statusClass = 'status--secondary';
            }
            
            webinarCard.innerHTML = `
                <div class="webinar-title">${webinar.title}</div>
                <div class="webinar-date">
                    ${webinar.date} • ${webinar.time}
                    <span class="status ${statusClass}" style="margin-left: 8px;">${webinar.status}</span>
                </div>
                <div class="webinar-stats">
                    <div>Registrations: <strong>${webinar.registrations}</strong></div>
                    <div>Attendees: <strong>${webinar.attendees}</strong></div>
                </div>
            `;
            
            webinarsList.appendChild(webinarCard);
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new StockTutorCRM();
    
    // Expose to global scope for debugging
    window.StockTutorCRM = app;
});