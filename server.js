class DiscordAccountManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadTokens();
        this.displayAccounts();
    }

    async loadTokens() {
        try {
            const response = await fetch('tokens.txt');
            if (!response.ok) {
                throw new Error('لم يتم العثور على ملف tokens.txt');
            }
            
            const text = await response.text();
            this.accounts = text.split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .map(token => this.createAccountObject(token));
            
            document.getElementById('loading').style.display = 'none';
            
        } catch (error) {
            this.showError(`خطأ في تحميل التوكنات: ${error.message}`);
        }
    }

    createAccountObject(token) {
        return {
            token: token,
            username: 'جاري التحميل...',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            status: 'offline',
            bio: '',
            id: Math.random().toString(36).substr(2, 9)
        };
    }

    displayAccounts() {
        const grid = document.getElementById('accountsGrid');
        const totalEl = document.getElementById('totalAccounts');
        const onlineEl = document.getElementById('onlineAccounts');
        
        totalEl.textContent = `إجمالي الحسابات: ${this.accounts.length}`;
        const onlineCount = this.accounts.filter(acc => acc.status !== 'offline').length;
        onlineEl.textContent = `الحسابات النشطة: ${onlineCount}`;

        grid.innerHTML = this.accounts.map(account => `
            <div class="account-card" data-account-id="${account.id}">
                <div class="account-header">
                    <img src="${account.avatar}" alt="Avatar" class="avatar" 
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div class="user-info">
                        <h3>${account.username}</h3>
                        <div class="token-preview">${account.token.substring(0, 15)}...</div>
                        <div>
                            الحالة: ${this.getStatusText(account.status)}
                            <span class="status-indicator status-${account.status}"></span>
                        </div>
                    </div>
                </div>
                
                <div class="controls">
                    <div class="control-group">
                        <label>اسم المستخدم:</label>
                        <input type="text" value="${account.username}" 
                               onchange="accountManager.updateAccount('${account.id}', 'username', this.value)">
                    </div>
                    
                    <div class="control-group">
                        <label>صورة الملف الشخصي (URL):</label>
                        <input type="text" value="${account.avatar}" 
                               onchange="accountManager.updateAccount('${account.id}', 'avatar', this.value)">
                    </div>
                    
                    <div class="control-group">
                        <label>البايو:</label>
                        <textarea rows="3" onchange="accountManager.updateAccount('${account.id}', 'bio', this.value)">${account.bio}</textarea>
                    </div>
                    
                    <div class="control-group">
                        <label>الحالة:</label>
                        <select onchange="accountManager.updateAccount('${account.id}', 'status', this.value)">
                            <option value="online" ${account.status === 'online' ? 'selected' : ''}>🟢 متصل</option>
                            <option value="idle" ${account.status === 'idle' ? 'selected' : ''}>🟡 غير متاح</option>
                            <option value="dnd" ${account.status === 'dnd' ? 'selected' : ''}>🔴 مشغول</option>
                            <option value="offline" ${account.status === 'offline' ? 'selected' : ''}>⚫ غير متصل</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary" onclick="accountManager.saveChanges('${account.id}')">
                        💾 حفظ التغييرات
                    </button>
                    
                    <button class="btn btn-danger" onclick="accountManager.refreshAccount('${account.id}')">
                        🔄 تحديث المعلومات
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'online': 'متصل',
            'idle': 'غير متاح', 
            'dnd': 'مشغول',
            'offline': 'غير متصل'
        };
        return statusMap[status] || 'غير معروف';
    }

    updateAccount(accountId, field, value) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (account) {
            account[field] = value;
            
            // تحديث الواجهة فوراً
            if (field === 'avatar') {
                const avatarImg = document.querySelector(`[data-account-id="${accountId}"] .avatar`);
                if (avatarImg) {
                    avatarImg.src = value;
                }
            }
            
            this.displayAccounts();
        }
    }

    async saveChanges(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;

        try {
            // هنا سيتم إضافة كود التحديث الفعلي عبر Discord API
            console.log('جاري حفظ التغييرات للحساب:', account.username);
            alert(`✅ تم حفظ التغييرات للحساب: ${account.username}`);
            
        } catch (error) {
            this.showError(`خطأ في حفظ التغييرات: ${error.message}`);
        }
    }

    async refreshAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;

        try {
            // محاكاة تحميل البيانات من Discord
            account.username = `User_${Math.floor(Math.random() * 1000)}`;
            account.avatar = `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`;
            account.status = ['online', 'idle', 'dnd', 'offline'][Math.floor(Math.random() * 4)];
            account.bio = 'هذا وصف تجريبي للحساب';
            
            this.displayAccounts();
            alert(`🔄 تم تحديث معلومات الحساب: ${account.username}`);
            
        } catch (error) {
            this.showError(`خطأ في تحديث الحساب: ${error.message}`);
        }
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        document.getElementById('loading').style.display = 'none';
    }
}

// بدء التطبيق
const accountManager = new DiscordAccountManager();