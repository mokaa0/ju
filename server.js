class DiscordAccountManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadTokens();
        await this.validateAllAccounts();
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
                .filter(line => line && line.length > 50)
                .map(token => ({
                    token: token,
                    id: Math.random().toString(36).substr(2, 9),
                    isValid: false,
                    isLoading: true,
                    data: null,
                    error: null
                }));
            
        } catch (error) {
            this.showError(`خطأ في تحميل التوكنات: ${error.message}`);
        }
    }

    async validateAllAccounts() {
        for (let account of this.accounts) {
            await this.validateAccount(account);
        }
        document.getElementById('loading').style.display = 'none';
    }

    async validateAccount(account) {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': account.token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const userData = await response.json();
                account.data = userData;
                account.isValid = true;
                account.isLoading = false;
            } else if (response.status === 401) {
                throw new Error('توكن غير صالح أو منتهي');
            } else {
                throw new Error(`خطأ في الخادم: ${response.status}`);
            }
        } catch (error) {
            account.error = error.message;
            account.isValid = false;
            account.isLoading = false;
            console.error('خطأ في التحقق:', error);
        }
    }

    displayAccounts() {
        const grid = document.getElementById('accountsGrid');
        const totalEl = document.getElementById('totalAccounts');
        const validEl = document.getElementById('validAccounts');
        
        totalEl.textContent = `إجمالي الحسابات: ${this.accounts.length}`;
        const validCount = this.accounts.filter(acc => acc.isValid).length;
        validEl.textContent = `الحسابات الصالحة: ${validCount}`;

        grid.innerHTML = this.accounts.map(account => this.createAccountCard(account)).join('');
    }

    createAccountCard(account) {
        if (account.isLoading) {
            return `
                <div class="account-card">
                    <div class="account-header">
                        <div class="avatar" style="background: #ccc;"></div>
                        <div class="user-info">
                            <h3>جاري التحميل...</h3>
                            <div class="user-details">جاري التحقق من التوكن</div>
                        </div>
                    </div>
                </div>
            `;
        }

        if (!account.isValid) {
            return `
                <div class="account-card">
                    <div class="account-header">
                        <div class="avatar" style="background: #ff6b6b;"></div>
                        <div class="user-info">
                            <h3 style="color: #ff6b6b;">توكن غير صالح</h3>
                            <div class="user-details">${account.error}</div>
                            <div class="token-preview">${account.token.substring(0, 25)}...</div>
                        </div>
                    </div>
                </div>
            `;
        }

        const user = account.data;
        const avatarUrl = user.avatar ? 
            `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` :
            `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

        return `
            <div class="account-card">
                <div class="account-header">
                    <img src="${avatarUrl}" alt="Avatar" class="avatar" 
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div class="user-info">
                        <h3>${user.username}<span class="badge badge-verified">#${user.discriminator}</span></h3>
                        <div class="user-details">
                            <strong>ID:</strong> ${user.id}<br>
                            <strong>البريد:</strong> ${user.email || 'غير متوفر'}<br>
                            <strong>أنشئ في:</strong> ${new Date(user.created_at).toLocaleDateString('ar-EG')}
                        </div>
                        <div class="token-preview">${account.token.substring(0, 20)}...</div>
                    </div>
                </div>
                
                <div class="controls">
                    <div class="control-group">
                        <label>البايو (الوصف):</label>
                        <textarea id="bio-${account.id}" placeholder="أدخل البايو الجديد..." rows="2"></textarea>
                    </div>
                    
                    <button class="btn btn-primary" onclick="accountManager.updateProfile('${account.id}')">
                        ✏️ تحديث البايو
                    </button>
                    
                    <button class="btn btn-success" onclick="accountManager.refreshAccount('${account.id}')">
                        🔄 تحديث المعلومات
                    </button>
                    
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button class="btn" onclick="accountManager.setStatus('${account.id}', 'online')" style="background: #23a55a; color: white; flex: 1;">🟢 Online</button>
                        <button class="btn" onclick="accountManager.setStatus('${account.id}', 'idle')" style="background: #f0b232; color: white; flex: 1;">🟡 Idle</button>
                        <button class="btn" onclick="accountManager.setStatus('${account.id}', 'dnd')" style="background: #f23f43; color: white; flex: 1;">🔴 DND</button>
                    </div>
                </div>
            </div>
        `;
    }

    async updateProfile(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account || !account.isValid) {
            this.showError('الحساب غير صالح');
            return;
        }

        const newBio = document.getElementById(`bio-${accountId}`).value;
        
        if (!newBio.trim()) {
            this.showError('يرجى إدخال نص للبايو');
            return;
        }

        try {
            console.log('جاري تحديث البايو...', newBio);
            
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                method: 'PATCH',
                headers: {
                    'Authorization': account.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: newBio
                })
            });

            console.log('الرد من السيرفر:', response.status);

            if (response.status === 200) {
                const updatedData = await response.json();
                account.data = updatedData;
                this.showSuccess('✅ تم تحديث البايو بنجاح');
                this.displayAccounts();
            } else {
                const errorText = await response.text();
                console.error('خطأ من السيرفر:', errorText);
                throw new Error(`فشل التحديث: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('خطأ في التحديث:', error);
            this.showError(`❌ خطأ في تحديث البايو: ${error.message}`);
        }
    }

    async setStatus(accountId, status) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account || !account.isValid) return;

        try {
            const response = await fetch('https://discord.com/api/v10/users/@me/settings', {
                method: 'PATCH',
                headers: {
                    'Authorization': account.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status
                })
            });

            if (response.status === 200) {
                this.showSuccess(`✅ تم تغيير الحالة إلى ${status}`);
            } else {
                throw new Error(`فشل تغيير الحالة: ${response.status}`);
            }
        } catch (error) {
            this.showError(`❌ خطأ في تغيير الحالة: ${error.message}`);
        }
    }

    async refreshAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;

        account.isLoading = true;
        this.displayAccounts();

        await this.validateAccount(account);
        this.displayAccounts();
        this.showSuccess('✅ تم تحديث معلومات الحساب');
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 5000);
    }

    showSuccess(message) {
        const successEl = document.getElementById('success');
        successEl.textContent = message;
        successEl.style.display = 'block';
        setTimeout(() => successEl.style.display = 'none', 5000);
    }
}

// بدء التطبيق
const accountManager = new DiscordAccountManager();

// إضافة event listeners للأزرار بعد تحميل الصفحة
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        const accountId = e.target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (accountId) {
            accountManager.updateProfile(accountId);
        }
    }
});