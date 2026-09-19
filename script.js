// --- SMART WHATSAPP AI ASSISTANT INTEGRATION ---
const WHATSAPP_NUMBER = "918401715116";

window.addEventListener("DOMContentLoaded", () => {
  createWhatsAppAssistantWidget();
  checkActiveSession();
  loadGoogleLiveRates();
  updateCartCount();

  let activeUser = JSON.parse(localStorage.getItem('chyris_active_user'));
  if (!activeUser) {
    setTimeout(() => {
      const modal = document.getElementById('loginModal');
      if (modal && modal.style.display !== 'flex') {
        modal.style.display = 'flex';
      }
    }, 10000);
  }
});

function createWhatsAppAssistantWidget() {
  if (document.getElementById('chyrisWaAssistantModal')) return;

  const assistantHtml = `
    <div id="chyrisWaAssistantModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2000; justify-content:center; align-items:center; backdrop-filter:blur(5px);">
      <div style="background:#0f0f0f; border:1px solid #d4af37; border-radius:12px; width:100%; max-width:440px; padding:30px; position:relative; box-shadow:0 15px 35px rgba(0,0,0,0.9); font-family:'Montserrat', sans-serif; color:#fff;">
        <button onclick="closeWaAssistant()" style="position:absolute; top:15px; right:20px; background:none; border:none; color:#aaa; font-size:22px; cursor:pointer;">&times;</button>
        
        <div style="text-align:center; margin-bottom:20px;">
          <span style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:1px;">AI CONCIERGE</span>
          <h3 style="font-family:'Cinzel', serif; font-size:22px; margin-top:10px; color:#fff;">CHYRIS Virtual Assistant</h3>
          <p style="font-size:13px; color:#aaa; margin-top:5px;">Select an option below or share your custom design inquiry with our experts.</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <button onclick="sendWaPreset('Explore Gold & Diamond Collections')" style="background:#141414; border:1px solid #333; color:#ddd; padding:12px 15px; border-radius:6px; text-align:left; cursor:pointer; font-size:13px;" onmouseover="this.style.borderColor='#d4af37';this.style.color='#d4af37'" onmouseout="this.style.borderColor='#333';this.style.color='#ddd'">✨ Explore Gold & Diamond Collections</button>
          
          <button onclick="sendWaPreset('Live Gold & Silver Rate Inquiry')" style="background:#141414; border:1px solid #333; color:#ddd; padding:12px 15px; border-radius:6px; text-align:left; cursor:pointer; font-size:13px;" onmouseover="this.style.borderColor='#d4af37';this.style.color='#d4af37'" onmouseout="this.style.borderColor='#333';this.style.color='#ddd'">📈 Check Today's Live Bullion Rates</button>
          
          <button onclick="promptCustomDesign()" style="background:#141414; border:1px solid #333; color:#ddd; padding:12px 15px; border-radius:6px; text-align:left; cursor:pointer; font-size:13px;" onmouseover="this.style.borderColor='#d4af37';this.style.color='#d4af37'" onmouseout="this.style.borderColor='#333';this.style.color='#ddd'">🎨 Custom Jewelry Design & Customization</button>
          
          <button onclick="sendWaPreset('Connect with a Human Jewelry Expert')" style="background:rgba(212,175,55,0.1); border:1px solid #d4af37; color:#d4af37; padding:12px 15px; border-radius:6px; text-align:left; cursor:pointer; font-size:13px; font-weight:600;" onmouseover="this.style.background='rgba(212,175,55,0.2)'" onmouseout="this.style.background='rgba(212,175,55,0.1)'">💬 Talk Directly with Expert Support</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', assistantHtml);
}

function openWhatsApp(product = "") {
  if (product) {
    const text = `Hello CHYRIS FINE JEWELLERY, I'm interested in the ${product}. Please share pricing and availability details.`;
    triggerWhatsAppRedirect(text);
  } else {
    const modal = document.getElementById('chyrisWaAssistantModal');
    if (modal) modal.style.display = 'flex';
  }
}

function closeWaAssistant() {
  const modal = document.getElementById('chyrisWaAssistantModal');
  if (modal) modal.style.display = 'none';
}

function sendWaPreset(topic) {
  const text = `Hello CHYRIS AI Assistant, I would like assistance regarding: ${topic}.`;
  triggerWhatsAppRedirect(text);
}

function promptCustomDesign() {
  const customIdea = prompt("Describe your custom jewelry idea (e.g., 22k gold necklace with uncut diamonds, ring size 7, etc.):");
  if (customIdea) {
    const text = `Hello CHYRIS FINE JEWELLERY, I want a Custom Design created: "${customIdea}". Please guide me through the custom manufacturing process.`;
    triggerWhatsAppRedirect(text);
  }
}

function triggerWhatsAppRedirect(text) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  if (!WHATSAPP_NUMBER.includes("X")) {
    window.open(url, "_blank", "noopener");
    closeWaAssistant();
  } else {
    alert("Please add CHYRIS's WhatsApp number first.");
  }
}

document.querySelectorAll("[data-product]").forEach(button => {
  button.addEventListener("click", () => openWhatsApp(button.dataset.product));
});

const whitelistedUsers = [
  { mobile: "+918401715116", pin: "1234", role: "admin", name: "Sumit (Owner)" },
  { mobile: "+917085658953", pin: "1234", role: "admin", name: "Admin Two" },
  { mobile: "+917405393841", pin: "1234", role: "admin", name: "Admin Three" },
  { mobile: "+919999999999", pin: "5678", role: "admin", name: "Co-Admin" },
  { mobile: "+918888888888", pin: "1111", role: "client", name: "VIP Member" }
];

function switchTab(mode) {
  const loginForm = document.getElementById('loginFormWrapper');
  const signupForm = document.getElementById('signupFormWrapper');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');

  if (mode === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    tabLoginBtn.style.color = 'var(--gold)';
    tabLoginBtn.style.borderBottom = '2px solid var(--gold)';
    tabSignupBtn.style.color = '#888';
    tabSignupBtn.style.borderBottom = 'none';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    tabSignupBtn.style.color = 'var(--gold)';
    tabSignupBtn.style.borderBottom = '2px solid var(--gold)';
    tabLoginBtn.style.color = '#888';
    tabLoginBtn.style.borderBottom = 'none';
  }
}

function handleCustomerSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const countryCode = document.getElementById('signupCountryCode').value;
  const rawMobile = document.getElementById('signupMobile').value.trim();
  const mobile = countryCode + rawMobile;
  const pin = document.getElementById('signupPassword').value.trim();

  let customUsers = JSON.parse(localStorage.getItem('chyris_custom_users')) || [];
  let existing = customUsers.find(u => u.mobile === mobile) || whitelistedUsers.find(u => u.mobile === mobile);
  
  if (existing) {
    alert('This mobile number is already registered. Please login instead.');
    switchTab('login');
    return;
  }

  const newUser = { mobile: mobile, pin: pin, role: "client", name: name };
  customUsers.push(newUser);
  localStorage.setItem('chyris_custom_users', JSON.stringify(customUsers));

  alert('Registration successful! Please login with your credentials.');
  switchTab('login');
}

function handleAuthorizedLogin(event) {
  event.preventDefault();
  const countryCode = document.getElementById('authCountryCode').value;
  const rawMobile = document.getElementById('authMobile').value.trim();
  const mobile = countryCode + rawMobile;
  const pin = document.getElementById('authPassword').value.trim();

  let customUsers = JSON.parse(localStorage.getItem('chyris_custom_users')) || [];
  let allUsers = [...whitelistedUsers, ...customUsers];
  let foundUser = allUsers.find(u => u.mobile === mobile && u.pin === pin);

  if (foundUser) {
    localStorage.setItem('chyris_active_user', JSON.stringify(foundUser));
    alert(`Welcome back, ${foundUser.name}!`);
    closeLoginModal();
    checkActiveSession();

    if (foundUser.role === 'admin') {
      window.location.href = 'admin.html';
    }
  } else {
    alert('Access Denied: Incorrect mobile number or PIN.');
  }
}

function checkActiveSession() {
  let activeUser = JSON.parse(localStorage.getItem('chyris_active_user'));
  if (activeUser) {
    const authBtn = document.getElementById('authButtonText');
    if (authBtn) {
      authBtn.innerHTML = `👤 ${activeUser.name} (<a href="#" onclick="logoutUser()" style="color:var(--gold)">Logout</a>)`;
    }
    if (activeUser.role === 'admin' && window.location.pathname.includes('index.html')) {
      window.location.href = 'admin.html';
    }
  }
}

function logoutUser() {
  localStorage.removeItem('chyris_active_user');
  window.location.reload();
}

async function loadGoogleLiveRates() {
  try {
    const res = await fetch('https://data-asg.goldprice.org/dbXRates/INR');
    const json = await res.json();
    if (json && json.items && json.items.length > 0) {
      let ouncePriceINR = json.items[0].xauPrice;
      let gold24k = Math.round(ouncePriceINR / 31.1034768);
      updateTickerDOM(gold24k, Math.round(json.items[0].xagPrice / 31.1034768));
      return;
    }
    throw new Error("Using fallback");
  } catch (err) {
    updateTickerDOM(15824, 255);
  }
}

function updateTickerDOM(gold24k, silverPerGram) {
  const r24 = document.getElementById('rate24k');
  const r18 = document.getElementById('rate18k');
  const r14 = document.getElementById('rate14k');
  const r9 = document.getElementById('rate9k');
  const rSilver = document.getElementById('rateSilver');

  if (r24) r24.innerText = '₹' + gold24k.toLocaleString('en-IN');
  if (r18) r18.innerText = '₹' + Math.round(gold24k * 0.75).toLocaleString('en-IN');
  if (r14) r14.innerText = '₹' + Math.round(gold24k * 0.585).toLocaleString('en-IN');
  if (r9) r9.innerText = '₹' + Math.round(gold24k * 0.375).toLocaleString('en-IN');
  if (rSilver) rSilver.innerText = '₹' + Math.round(silverPerGram).toLocaleString('en-IN');
}

function openLoginModal() { 
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex'; 
}

function closeLoginModal() { 
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none'; 
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('chyris_cart')) || [];
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.innerText = cart.length;
}
