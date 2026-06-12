// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
    apiKey: "AIzaSyA0h41dnLHhll9QebR4fkiaiG8C3cdo8Es",
    authDomain: "abm-billing.firebaseapp.com",
    projectId: "abm-billing",
    storageBucket: "abm-billing.firebasestorage.app",
    messagingSenderId: "774462936172",
    appId: "1:774462936172:web:3312f7c3876aa09ba77449",
    measurementId: "G-6ZN8GZYY8Q"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ==================== STATE ====================
let currentLang = 'ta';
let chatState = 'init';
let selectedDepartment = '';
let complaintNumber = '';
let uploadedImageURL = '';
let voiceRecorded = false;

const tnDistricts = [
    'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem',
    'Tirunelveli','Tiruppur','Erode','Vellore','Thoothukudi',
    'Dindigul','Thanjavur','Ranipet','Sivaganga','Karur',
    'Namakkal','Cuddalore','Nagapattinam','Virudhunagar','Kanniyakumari',
    'Theni','Krishnagiri','Perambalur','Ariyalur','Nilgiris',
    'Dharmapuri','Ramanathapuram','Villupuram','Pudukkottai','Tirupattur',
    'Tiruvannamalai','Chengalpattu','Kancheepuram','Kallakurichi',
    'Tenkasi','Mayiladuthurai','Tiruvallur'
];

const tnTaluks = {
    'Chennai': ['Tondiarpet','Fort Tondiarpet','Egmore-Nungambakkam','Mambalam-Guindy','Mylapore-Triplicane','Perambur-Purasawalkam','Ambattur','Madhavaram','Sholinganallur','Alandur','Tiruvottiyur'],
    'Coimbatore': ['Coimbatore North','Coimbatore South','Mettupalayam','Sulur','Pollachi','Valparai','Annur','Kinathukadavu','Madukkarai','Perur'],
    'Madurai': ['Madurai North','Madurai South','Melur','Thirumangalam','Usilampatti','Vadipatti','Peraiyur','Kallikudi'],
    'Tiruchirappalli': ['Tiruchirappalli','Srirangam','Lalgudi','Manachanallur','Musiri','Thottiyam','Thuraiyur','Manapparai'],
    'Salem': ['Salem','Attur','Mettur','Omalur','Gangavalli','Yercaud','Edappadi','Sankagiri'],
    'Tirunelveli': ['Tirunelveli','Palayamkottai','Ambasamudram','Cheranmahadevi','Nanguneri','Radhapuram','Sankarankovil','Tenkasi'],
    'Tiruppur': ['Tiruppur North','Tiruppur South','Avinashi','Palladam','Dharapuram','Udumalpet','Kangeyam','Madathukulam'],
    'Erode': ['Erode','Bhavani','Gobichettipalayam','Sathyamangalam','Perundurai','Anthiyur','Nambiyur','Modakurichi'],
    'Vellore': ['Vellore','Arcot','Gudiyatham','Ambur','Katpadi','Anaicut','Sholinghur','Walajah'],
    'Thoothukudi': ['Thoothukudi','Kovilpatti','Tiruchendur','Vilathikulam','Ottapidaram','Srivaikuntam','Kayathar','Sathankulam'],
    'Dindigul': ['Dindigul','Palani','Oddanchatram','Natham','Nilakottai','Vedasandur','Kodaikanal','Athoor'],
    'Thanjavur': ['Thanjavur','Kumbakonam','Papanasam','Pattukkottai','Peravurani','Orathanadu','Thiruvaiyaru','Thiruvidaimarudur'],
    'Ranipet': ['Ranipet','Arakkonam','Walajapet','Arcot','Sholinghur','Nemili','Timiri'],
    'Sivaganga': ['Sivaganga','Karaikudi','Devakottai','Manamadurai','Ilayangudi','Tirupathur','Kalayarkoil'],
    'Karur': ['Karur','Kulithalai','Aravakurichi','Krishnarayapuram','Pugalur','Manmangalam','Kadavur'],
    'Namakkal': ['Namakkal','Rasipuram','Tiruchengode','Paramathi-Velur','Komarapalayam','Mohanur','Sendamangalam'],
    'Cuddalore': ['Cuddalore','Chidambaram','Virudhachalam','Panruti','Kattumannarkoil','Tittakudi','Kurinjipadi','Bhuvanagiri'],
    'Nagapattinam': ['Nagapattinam','Sirkazhi','Thirukkuvalai','Kilvelur','Vedaranyam','Mayiladuthurai','Tharangambadi'],
    'Virudhunagar': ['Virudhunagar','Sivakasi','Rajapalayam','Srivilliputhur','Aruppukkottai','Sattur','Tiruchuli','Kariyapatti'],
    'Kanniyakumari': ['Nagercoil','Thuckalay','Agastheeswaram','Vilavancode','Kalkulam','Thiruvattar','Killiyoor','Kurunthencode'],
    'Theni': ['Theni','Periyakulam','Bodinayakanur','Uthamapalayam','Andipatti','Cumbum','Myladumparai'],
    'Krishnagiri': ['Krishnagiri','Hosur','Denkanikottai','Pochampalli','Uthangarai','Veppanapalli','Kaveripattinam','Bargur'],
    'Perambalur': ['Perambalur','Kunnam','Veppanthattai','Alathur'],
    'Ariyalur': ['Ariyalur','Jayamkondam','Sendurai','Andimadam','Udayarpalayam','Thirumanur'],
    'Nilgiris': ['Udhagamandalam','Coonoor','Kotagiri','Gudalur','Pandalur','Kundah'],
    'Dharmapuri': ['Dharmapuri','Harur','Palacode','Pennagaram','Nallampalli','Karimangalam','Pappireddipatti','Morappur'],
    'Ramanathapuram': ['Ramanathapuram','Paramakudi','Rameswaram','Mudukulathur','Tiruvadanai','Kadaladi','Kamuthi'],
    'Villupuram': ['Villupuram','Tindivanam','Gingee','Vanur','Kandachipuram','Ulundurpet','Sankarapuram','Kallakurichi'],
    'Pudukkottai': ['Pudukkottai','Aranthangi','Alangudi','Avudayarkoil','Gandarvakottai','Illupur','Thirumayam','Manamelkudi'],
    'Tirupattur': ['Tirupattur','Vaniyambadi','Ambur','Natrampalli','Jolarpet','Kandili'],
    'Tiruvannamalai': ['Tiruvannamalai','Arani','Polur','Cheyyar','Vandavasi','Chengam','Kilpennathur','Thandarampattu'],
    'Chengalpattu': ['Chengalpattu','Tambaram','Pallavaram','Madurantakam','Tirukalukundram','Kattankulathur','Thiruporur','Vandalur'],
    'Kancheepuram': ['Kancheepuram','Sriperumbudur','Uthiramerur','Kundrathur','Walajabad'],
    'Kallakurichi': ['Kallakurichi','Ulundurpet','Sankarapuram','Tirukoilur','Chinnasalem','Rishivandiyam'],
    'Tenkasi': ['Tenkasi','Sankarankovil','Kadayanallur','Shencottai','Alangulam','Vasudevanallur','Thiruvengadam'],
    'Mayiladuthurai': ['Mayiladuthurai','Sirkazhi','Kuthalam','Tharangambadi','Poompuhar','Sembanarkoil'],
    'Tiruvallur': ['Tiruvallur','Ponneri','Gummidipoondi','Tiruttani','Poonamallee','Avadi','Ambattur','Pallipattu']
};

const departments = [
    { id:'tneb', name:'TNEB (மின்சார வாரியம்)', nameEn:'TNEB (Electricity Board)', icon:'fa-bolt', division:'TNEB', divisionTa:'TNEB மின்சார வாரியம்' },
    { id:'water', name:'குடிநீர் வாரியம்', nameEn:'Water Board', icon:'fa-tint', division:'TN Water Board', divisionTa:'தமிழ்நாடு குடிநீர் வாரியம்' },
    { id:'roads', name:'சாலை & நெடுஞ்சாலை', nameEn:'Roads & Highways', icon:'fa-road', division:'TN Highways Dept', divisionTa:'தமிழ்நாடு நெடுஞ்சாலைத் துறை' },
    { id:'health', name:'சுகாதாரத் துறை', nameEn:'Health Department', icon:'fa-heartbeat', division:'TN Health Dept', divisionTa:'தமிழ்நாடு சுகாதாரத் துறை' },
    { id:'revenue', name:'வருவாய்த் துறை', nameEn:'Revenue Department', icon:'fa-landmark', division:'TN Revenue Dept', divisionTa:'தமிழ்நாடு வருவாய்த் துறை' }
];

const statusFlow = ['filed','routed','acknowledged','in_progress','resolved'];
const statusLabels = {
    filed:{ta:'புகார் பதிவு',en:'Filed'},
    routed:{ta:'AI வழி ஒதுக்கீடு',en:'AI Routed'},
    acknowledged:{ta:'ஒப்புக்கொள்ளப்பட்டது',en:'Acknowledged'},
    in_progress:{ta:'நடப்பில் உள்ளது',en:'In Progress'},
    resolved:{ta:'தீர்க்கப்பட்டது',en:'Resolved'}
};

// ==================== FIREBASE DB OPERATIONS ====================
async function saveComplaintToDB(complaint) {
    try {
        await db.collection('mkkm_complaints').doc(complaint.id).set({
            ...complaint,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Saved:', complaint.id);
        return true;
    } catch(e) {
        console.error('❌ Save error:', e);
        return false;
    }
}

async function getComplaintFromDB(id) {
    try {
        const doc = await db.collection('mkkm_complaints').doc(id).get();
        return doc.exists ? doc.data() : null;
    } catch(e) {
        console.error('❌ Get error:', e);
        return null;
    }
}

async function getAllComplaints() {
    try {
        const snapshot = await db.collection('mkkm_complaints').orderBy('createdAt','desc').get();
        return snapshot.docs.map(d => d.data());
    } catch(e) {
        console.error('❌ GetAll error:', e);
        return [];
    }
}

async function updateComplaintInDB(id, updates) {
    try {
        await db.collection('mkkm_complaints').doc(id).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Updated:', id);
        return true;
    } catch(e) {
        console.error('❌ Update error:', e);
        return false;
    }
}

async function getNextComplaintNumber() {
    try {
        const doc = await db.collection('mkkm_config').doc('counter').get();
        let next = 10001;
        if (doc.exists) next = doc.data().lastNumber + 1;
        await db.collection('mkkm_config').doc('counter').set({ lastNumber: next, updatedAt: new Date().toISOString() });
        return `TN2024${next}`;
    } catch(e) {
        return `TN2024${Date.now() % 100000}`;
    }
}

// Real-time listener for dashboard
function listenToComplaints(callback) {
    return db.collection('mkkm_complaints').orderBy('createdAt','desc').onSnapshot(snapshot => {
        const list = snapshot.docs.map(d => d.data());
        callback(list);
    });
}

// ==================== IMAGE UPLOAD (Base64 - no Storage dependency) ====================
function uploadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Compress by resizing if too large
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxW = 400;
                let w = img.width, h = img.height;
                if(w > maxW) { h = h * maxW / w; w = maxW; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if (screenId === 'whatsapp-screen' && chatState === 'init') startChat();
    if (screenId === 'tracking-screen') showRecentComplaints();
    if (screenId === 'mla-dashboard') refreshDashboard();
}

function openWhatsApp() { chatState = 'init'; showScreen('whatsapp-screen'); }
function goHome() { chatState = 'init'; showScreen('landing-screen'); }

// ==================== LANGUAGE ====================
function toggleLanguage() {
    currentLang = currentLang === 'ta' ? 'en' : 'ta';
    document.getElementById('lang-btn').textContent = currentLang === 'ta' ? 'EN / தமிழ்' : 'தமிழ் / EN';
    document.querySelectorAll('[data-ta][data-en]').forEach(el => {
        el.textContent = currentLang === 'ta' ? el.getAttribute('data-ta') : el.getAttribute('data-en');
    });
}

// ==================== CHAT HELPERS ====================
function getTime() { return new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}); }
function getDateTimeStr() { return new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true}); }

function addMessage(content, type='incoming', isHtml=false) {
    const chat = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    if (isHtml) div.innerHTML = content + `<div class="message-time">${getTime()}</div>`;
    else { div.textContent = content; const t=document.createElement('div'); t.className='message-time'; t.textContent=getTime(); div.appendChild(t); }
    chat.appendChild(div);
    scrollChat();
    return div;
}

function scrollChat() { const c=document.getElementById('chat-container'); setTimeout(()=>{c.scrollTop=c.scrollHeight;},50); }

function addTypingIndicator() {
    const chat=document.getElementById('chat-container');
    const t=document.createElement('div'); t.className='message incoming'; t.id='typing-indicator';
    t.innerHTML='<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chat.appendChild(t); scrollChat();
}
function removeTypingIndicator() { const e=document.getElementById('typing-indicator'); if(e) e.remove(); }

// ==================== CHAT BOT FLOW ====================
function startChat() {
    chatState='welcome';
    uploadedImageURL=''; voiceRecorded=false;
    const chat=document.getElementById('chat-container');
    chat.innerHTML='<div class="chat-date">Today</div>';
    addTypingIndicator();
    setTimeout(()=>{
        removeTypingIndicator();
        const msg = currentLang==='ta'
            ? `🏛️ <strong>மக்கள் குறை தீர்ப்பு மேடை</strong>க்கு வரவேற்கிறோம்!<br><br>தமிழ்நாடு அரசின் AI-இயக்கப்படும் குறை தீர்ப்பு அமைப்பு.<br><br>உங்கள் புகாரை பதிவு செய்ய துறையைத் தேர்ந்தெடுக்கவும்:`
            : `🏛️ Welcome to <strong>Makkal Kurai Theerpu Medai</strong>!<br><br>AI-Powered Grievance Redressal System by Govt of TN.<br><br>Select the department:`;
        addMessage(msg,'incoming',true);
        setTimeout(()=>showDepartmentMenu(),400);
    },1200);
}

function showDepartmentMenu() {
    const chat=document.getElementById('chat-container');
    const div=document.createElement('div'); div.className='message incoming'; div.style.padding='8px';
    let html='<div class="dept-menu">';
    departments.forEach(d=>{
        const n=currentLang==='ta'?d.name:d.nameEn;
        html+=`<button class="dept-btn" onclick="selectDepartment('${d.id}')"><i class="fas ${d.icon}"></i>${n}</button>`;
    });
    html+='</div>';
    div.innerHTML=html; chat.appendChild(div); scrollChat(); chatState='department';
}

function selectDepartment(id) {
    selectedDepartment=id;
    const dept=departments.find(d=>d.id===id);
    addMessage(currentLang==='ta'?dept.name:dept.nameEn,'outgoing');
    document.querySelectorAll('.dept-btn').forEach(b=>b.disabled=true);
    addTypingIndicator();
    setTimeout(()=>{ removeTypingIndicator(); showComplaintForm(dept); },800);
}

function showComplaintForm(dept) {
    chatState='form';
    const deptName=currentLang==='ta'?dept.name:dept.nameEn;
    addMessage(`✅ <strong>${deptName}</strong> ${currentLang==='ta'?'தேர்ந்தெடுக்கப்பட்டது.':'selected.'}<br><br>${currentLang==='ta'?'புகார் விவரங்களை நிரப்பவும்:':'Fill complaint details:'}`,'incoming',true);
    
    setTimeout(()=>{
        const formDiv=document.createElement('div'); formDiv.className='message incoming'; formDiv.style.maxWidth='88%'; formDiv.style.padding='10px';
        const opts=tnDistricts.map(d=>`<option value="${d}">${d}</option>`).join('');
        const L={
            name:currentLang==='ta'?'உங்கள் பெயர்':'Your Name',
            mobile:currentLang==='ta'?'கைபேசி எண் (10 இலக்கம்)':'Mobile (10 digits)',
            district:currentLang==='ta'?'மாவட்டம்':'District',
            taluk:currentLang==='ta'?'வட்டம்':'Taluk',
            street:currentLang==='ta'?'தெரு பெயர்':'Street Name',
            pincode:currentLang==='ta'?'அஞ்சல் குறியீடு (6 இலக்கம்)':'Pincode (6 digits)',
            title:currentLang==='ta'?'புகார் தலைப்பு':'Problem Title',
            desc:currentLang==='ta'?'விரிவான விளக்கம்':'Description',
            gps:currentLang==='ta'?'📍 GPS':'📍 GPS',
            upload:currentLang==='ta'?'📷 படம்':'📷 Photo',
            voice:currentLang==='ta'?'🎤 குரல்':'🎤 Voice',
            submit:currentLang==='ta'?'📤 புகார் சமர்ப்பி':'📤 Submit'
        };
        formDiv.innerHTML=`
            <div class="chat-form" id="complaint-form">
                <input type="text" id="form-name" placeholder="${L.name}">
                <input type="tel" id="form-mobile" placeholder="${L.mobile}" maxlength="10" oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,10)">
                <div class="form-row">
                    <select id="form-district" onchange="updateTalukDropdown()"><option value="">${L.district}</option>${opts}</select>
                    <select id="form-taluk"><option value="">${L.taluk}</option></select>
                </div>
                <input type="text" id="form-street" placeholder="${L.street}">
                <input type="tel" id="form-pincode" placeholder="${L.pincode}" maxlength="6" oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,6)">
                <input type="text" id="form-title" placeholder="${L.title}">
                <textarea id="form-desc" placeholder="${L.desc}"></textarea>
                <div class="action-btn-row">
                    <button class="action-btn" id="voice-btn" onclick="startVoiceRecording()"><i class="fas fa-microphone"></i> ${L.voice}</button>
                    <button class="action-btn" id="gps-btn" onclick="mockGPS()"><i class="fas fa-map-marker-alt"></i> ${L.gps}</button>
                    <button class="action-btn" id="upload-btn" onclick="triggerImageUpload()"><i class="fas fa-camera"></i> ${L.upload}</button>
                </div>
                <input type="file" id="image-file-input" accept="image/*" style="display:none" onchange="handleImageUpload(event)">
                <div id="image-preview" style="display:none;"></div>
                <button class="submit-btn" onclick="submitComplaint()">📤 ${L.submit}</button>
            </div>`;
        document.getElementById('chat-container').appendChild(formDiv); scrollChat();
    },200);
}

// Update Taluk dropdown based on selected District
function updateTalukDropdown() {
    const district = document.getElementById('form-district').value;
    const talukSelect = document.getElementById('form-taluk');
    const talukLabel = currentLang==='ta'?'வட்டம்':'Taluk';
    talukSelect.innerHTML = `<option value="">${talukLabel}</option>`;
    if(district && tnTaluks[district]) {
        tnTaluks[district].forEach(t => {
            talukSelect.innerHTML += `<option value="${t}">${t}</option>`;
        });
    }
}

let gpsLocation = '';

function mockGPS() {
    const btn=document.getElementById('gps-btn');
    if(btn.classList.contains('active'))return;
    // Try real GPS first
    if(navigator.geolocation) {
        btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Getting...';
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                gpsLocation = `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`;
                btn.classList.add('active');
                btn.innerHTML=`<i class="fas fa-check-circle"></i> ${gpsLocation}`;
            },
            () => {
                // Fallback mock
                gpsLocation = '13.0418°N, 80.2341°E';
                btn.classList.add('active');
                btn.innerHTML=`<i class="fas fa-check-circle"></i> ${gpsLocation}`;
            },
            {timeout:3000}
        );
    } else {
        gpsLocation = '13.0418°N, 80.2341°E';
        btn.classList.add('active');
        btn.innerHTML=`<i class="fas fa-check-circle"></i> ${gpsLocation}`;
    }
}

function triggerImageUpload() { document.getElementById('image-file-input').click(); }

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if(!file) return;
    const btn=document.getElementById('upload-btn');
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    const url = await uploadImage(file);
    if(url) {
        uploadedImageURL = url;
        btn.classList.add('active');
        btn.innerHTML='<i class="fas fa-check-circle"></i> ✅ Uploaded';
        // Show preview
        const preview = document.getElementById('image-preview');
        preview.style.display='block';
        preview.innerHTML=`<img src="${url}" style="width:100%;max-height:120px;object-fit:cover;border-radius:6px;margin-top:5px;">`;
    } else {
        btn.innerHTML='<i class="fas fa-times-circle"></i> Failed';
    }
}

// ==================== VOICE RECORDING ====================
let mediaRecorder = null;
let audioChunks = [];

function startVoiceRecording() {
    const btn=document.getElementById('voice-btn');
    if(btn.classList.contains('active')) return;
    
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback mock for demo
        mockVoiceRecord();
        return;
    }
    
    navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            stream.getTracks().forEach(t=>t.stop());
            voiceRecorded = true;
            btn.classList.add('active');
            btn.innerHTML='<i class="fas fa-check-circle"></i> 🎤 Recorded';
        };
        mediaRecorder.start();
        btn.style.borderColor='#ff4444'; btn.style.color='#ff4444';
        btn.innerHTML='<i class="fas fa-circle"></i> REC...';
        
        // Auto-stop after 5s
        setTimeout(()=>{ if(mediaRecorder && mediaRecorder.state==='recording') mediaRecorder.stop(); },5000);
        
        // Stop on click
        btn.onclick = ()=>{ if(mediaRecorder && mediaRecorder.state==='recording') mediaRecorder.stop(); };
    }).catch(()=>{
        mockVoiceRecord();
    });
}

function mockVoiceRecord() {
    const btn=document.getElementById('voice-btn');
    btn.style.borderColor='#ff4444'; btn.style.color='#ff4444';
    btn.innerHTML='<i class="fas fa-circle"></i> REC 0:03';
    let s=3;
    const i=setInterval(()=>{
        s++;
        btn.innerHTML=`<i class="fas fa-circle"></i> REC 0:${s.toString().padStart(2,'0')}`;
        if(s>=5){clearInterval(i);btn.style.borderColor='';btn.style.color='';btn.classList.add('active');btn.innerHTML='<i class="fas fa-check-circle"></i> 🎤 0:05';voiceRecorded=true;}
    },1000);
}

// ==================== SUBMIT COMPLAINT ====================
async function submitComplaint() {
    chatState='submitting';
    const name=document.getElementById('form-name').value.trim()||'Demo User';
    const mobile=document.getElementById('form-mobile').value.trim()||'9876543210';
    const district=document.getElementById('form-district').value||'Chennai';
    const taluk=document.getElementById('form-taluk').value||'T. Nagar';
    const street=document.getElementById('form-street').value.trim()||'';
    const pincode=document.getElementById('form-pincode').value.trim()||'';
    const title=document.getElementById('form-title').value.trim()||(currentLang==='ta'?'பொது புகார்':'General Complaint');
    const desc=document.getElementById('form-desc').value.trim()||'';

    if(mobile.length!==10){alert(currentLang==='ta'?'10 இலக்க கைபேசி எண் தேவை':'Please enter 10 digit mobile number');return;}
    if(pincode && pincode.length!==6){alert(currentLang==='ta'?'6 இலக்க அஞ்சல் குறியீடு தேவை':'Please enter 6 digit pincode');return;}

    document.querySelectorAll('#complaint-form input,#complaint-form select,#complaint-form textarea,#complaint-form button').forEach(el=>{el.disabled=true;el.style.opacity='0.5';});

    const streetInfo=street?`, ${street}`:'';
    const pincodeInfo=pincode?` - ${pincode}`:'';
    addMessage(`👤 ${name}<br>📱 ${mobile}<br>📍 ${district}, ${taluk}${streetInfo}${pincodeInfo}<br>📝 ${title}${uploadedImageURL?'<br>📷 Image attached':''}${voiceRecorded?'<br>🎤 Voice attached':''}`,'outgoing',true);

    setTimeout(()=>showAIRouting(name,mobile,district,taluk,street,pincode,title,desc),600);
}

function showAIRouting(name,mobile,district,taluk,street,pincode,title,desc) {
    const chat=document.getElementById('chat-container');
    const dept=departments.find(d=>d.id===selectedDepartment);
    const aiDiv=document.createElement('div'); aiDiv.className='message incoming'; aiDiv.id='ai-routing-msg'; aiDiv.style.maxWidth='85%';
    aiDiv.innerHTML=`<div class="ai-routing"><div class="ai-icon"><i class="fas fa-brain"></i></div><div class="ai-text">${currentLang==='ta'?'AI பகுப்பாய்வு...':'AI Analysis...'}</div><div class="ai-dots"><span></span><span></span><span></span></div></div>`;
    chat.appendChild(aiDiv); scrollChat();

    setTimeout(()=>{aiDiv.querySelector('.ai-text').textContent=currentLang==='ta'?`🔍 வகைப்படுத்துதல்... ${dept.divisionTa}`:`🔍 Classifying... ${dept.division}`;},1200);
    setTimeout(()=>{aiDiv.querySelector('.ai-text').textContent=currentLang==='ta'?`🗺️ ${district} → ${taluk}`:`🗺️ ${district} → ${taluk}`;},2500);
    setTimeout(()=>{aiDiv.querySelector('.ai-text').textContent=currentLang==='ta'?`👤 ${dept.divisionTa} - ${district}`:`👤 ${dept.division} - ${district}`;},3800);
    setTimeout(()=>{aiDiv.remove();showSuccess(name,mobile,district,taluk,street,pincode,title,desc,dept);},5200);
}

async function showSuccess(name,mobile,district,taluk,street,pincode,title,desc,dept) {
    complaintNumber = await getNextComplaintNumber();
    const assignedTo=`${dept.division} - ${district} Division`;
    const assignedToTa=`${dept.divisionTa} - ${district} Division`;

    const complaint={
        id:complaintNumber, name, mobile, district, taluk, street:street||'', pincode:pincode||'',
        title, description:desc,
        department:dept.id, departmentName:dept.nameEn, departmentNameTa:dept.name,
        assignedTo, assignedToTa, status:'routed',
        imageURL:uploadedImageURL||'', voiceAttached:voiceRecorded,
        gpsLocation: gpsLocation||'',
        createdAt:new Date().toISOString(),
        timeline:[
            {status:'filed',time:getDateTimeStr(),note:''},
            {status:'routed',time:getDateTimeStr(),note:`${assignedToTa}-க்கு ஒதுக்கப்பட்டது`}
        ]
    };

    await saveComplaintToDB(complaint);

    const chat=document.getElementById('chat-container');
    const div=document.createElement('div'); div.className='message incoming'; div.style.maxWidth='85%';
    div.innerHTML=`<div class="success-card"><div class="success-icon"><i class="fas fa-check-circle"></i></div><div><strong>${currentLang==='ta'?'✅ புகார் பதிவு வெற்றி!':'✅ Complaint Registered!'}</strong></div><div class="complaint-num">${complaintNumber}</div><div class="assigned-to">📋 ${currentLang==='ta'?assignedToTa:'Assigned to '+assignedTo}</div><br><small style="color:var(--text-muted)">${currentLang==='ta'?'இந்த எண்ணை வைத்து கண்காணிக்கலாம்':'Track using this number'}</small></div><div class="message-time">${getTime()}</div>`;
    chat.appendChild(div); scrollChat(); chatState='done';

    setTimeout(()=>{
        addMessage(`📱 SMS → ${mobile}<br>⏱️ ${currentLang==='ta'?'தீர்வு: 24-48 hrs':'Resolution: 24-48 hrs'}<br>🙏 ${currentLang==='ta'?'புதிய புகார்: "Hi" | நிலை: Complaint ID அனுப்புங்கள்':'New complaint: "Hi" | Status: Send complaint ID'}`,'incoming',true);
    },1200);
}

// ==================== TRACKING ====================
async function showRecentComplaints() {
    const container=document.getElementById('recent-complaints');
    container.innerHTML='<p style="text-align:center;padding:10px;color:#999;font-size:0.8rem;">Loading...</p>';
    const complaints=await getAllComplaints();
    if(!complaints.length){container.innerHTML=`<p style="color:#999;font-size:0.8rem;text-align:center;padding:20px;">${currentLang==='ta'?'புகார்கள் இல்லை':'No complaints yet'}</p>`;return;}
    let html=`<h4>${currentLang==='ta'?'📋 சமீபத்திய புகார்கள்':'📋 Recent Complaints'}</h4>`;
    complaints.slice(0,10).forEach(c=>{
        const sl=statusLabels[c.status]?statusLabels[c.status][currentLang]:c.status;
        const sc=c.status==='in_progress'?'progress':c.status;
        html+=`<div class="recent-item" onclick="trackSpecific('${c.id}')"><div class="recent-item-left"><span class="recent-item-num">${c.id}</span><span class="recent-item-desc">${c.title||''} | ${c.district||''}</span></div><span class="complaint-status status-${sc}">${sl}</span></div>`;
    });
    container.innerHTML=html;
}

function trackSpecific(id){document.getElementById('tracking-input').value=id;trackComplaint();}

async function trackComplaint() {
    const input=document.getElementById('tracking-input').value.trim();
    const result=document.getElementById('tracking-result');
    if(!input){result.innerHTML=`<p style="color:#ff6b6b;font-size:0.8rem;padding:10px;">${currentLang==='ta'?'எண் உள்ளிடவும்':'Enter number'}</p>`;return;}
    
    result.innerHTML='<p style="text-align:center;padding:10px;color:#999;">Loading...</p>';
    const c=await getComplaintFromDB(input);
    if(!c){result.innerHTML=`<p style="color:#ff6b6b;font-size:0.8rem;padding:10px;">❌ ${currentLang==='ta'?'கிடைக்கவில்லை':'Not found'}</p>`;return;}

    const cidx=statusFlow.indexOf(c.status);
    let tl='';
    statusFlow.forEach((s,i)=>{
        let cls=i<cidx?'completed':i===cidx?'active':'pending';
        const lbl=statusLabels[s][currentLang];
        const entry=c.timeline?c.timeline.find(t=>t.status===s):null;
        const time=entry?entry.time:(currentLang==='ta'?'நிலுவையில்':'Pending');
        const note=entry&&entry.note?`<span class="timeline-badge">${entry.note}</span>`:'';
        tl+=`<div class="timeline-item ${cls}"><div class="timeline-dot"></div><div class="timeline-content"><h4>${lbl}</h4><p>${time}</p>${note}</div></div>`;
    });

    const sl=statusLabels[c.status]?statusLabels[c.status][currentLang]:c.status;
    const sc=c.status==='in_progress'?'progress':c.status;
    const imgHtml=c.imageURL?`<p><strong>${currentLang==='ta'?'படம்:':'Image:'}</strong><br><img src="${c.imageURL}" style="width:100%;max-height:150px;object-fit:cover;border-radius:6px;margin-top:5px;"></p>`:'';
    const voiceHtml=c.voiceAttached?`<p><strong>🎤 ${currentLang==='ta'?'குரல் இணைப்பு உள்ளது':'Voice attached'}</strong></p>`:'';

    const streetHtml=c.street?`<p><strong>${currentLang==='ta'?'தெரு:':'Street:'}</strong> ${c.street}</p>`:'';
    const pincodeHtml=c.pincode?`<p><strong>${currentLang==='ta'?'அஞ்சல் குறியீடு:':'Pincode:'}</strong> ${c.pincode}</p>`:'';

    result.innerHTML=`<div class="complaint-card"><div class="complaint-header"><span class="complaint-number">${c.id}</span><span class="complaint-status status-${sc}">${sl}</span></div><div class="complaint-details"><p><strong>${currentLang==='ta'?'துறை:':'Dept:'}</strong> ${currentLang==='ta'?c.departmentNameTa:c.departmentName}</p><p><strong>${currentLang==='ta'?'புகார்:':'Issue:'}</strong> ${c.title}</p><p><strong>${currentLang==='ta'?'பகுதி:':'Area:'}</strong> ${c.taluk}, ${c.district}</p>${streetHtml}${pincodeHtml}<p><strong>${currentLang==='ta'?'ஒதுக்கீடு:':'Assigned:'}</strong> ${currentLang==='ta'?c.assignedToTa:c.assignedTo}</p>${imgHtml}${voiceHtml}</div></div><div class="timeline">${tl}</div>`;
}

// ==================== MLA DASHBOARD ====================
let unsubscribe = null;

function switchDashTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    if(tabId==='complaints') renderDashList();
    if(tabId==='actions') populateActionSelect();
}

function refreshDashboard() {
    if(unsubscribe) unsubscribe();
    unsubscribe = listenToComplaints(complaints => {
        window._dashComplaints = complaints;
        renderDashList();
        populateActionSelect();
        updateOverviewStats(complaints);
        updateWeeklyGraph(complaints);
        updateAreaChart(complaints);
        updateCategoryChart(complaints);
    });
}

// ==================== DYNAMIC OVERVIEW STATS & WEEKLY GRAPH ====================
function updateOverviewStats(complaints) {
    if(!complaints || !complaints.length) return;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const pending = complaints.filter(c => c.status !== 'resolved').length;
    
    // Today's complaints
    const newToday = complaints.filter(c => {
        const d = new Date(c.createdAt);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
    }).length;
    
    // Resolved today
    const resolvedToday = complaints.filter(c => {
        if(c.status !== 'resolved' || !c.timeline) return false;
        const resolvedEntry = c.timeline.find(t => t.status === 'resolved');
        if(!resolvedEntry || !resolvedEntry.time) return false;
        const d = new Date(resolvedEntry.time);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
    }).length;
    
    // Resolution rate
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';
    
    // Update DOM elements if they exist
    const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
    el('overview-total', total);
    el('overview-new', newToday);
    el('overview-resolved', resolved);
    el('overview-today-resolved', resolvedToday);
    el('overview-pending', pending);
    el('trust-resolution', resolutionRate + '%');
    
    // Update trust donut (stroke-dasharray based on percentage)
    const percent = total > 0 ? (resolved / total) * 100 : 0;
    const circumference = 2 * Math.PI * 50; // r=50
    const filled = (percent / 100) * circumference;
    const remaining = circumference - filled;
    const donutCircle = document.querySelector('.donut-svg circle:nth-child(2)');
    if(donutCircle) {
        donutCircle.setAttribute('stroke-dasharray', `${filled.toFixed(0)} ${remaining.toFixed(0)}`);
    }
    const trustPercent = document.getElementById('trust-percent');
    if(trustPercent) trustPercent.textContent = Math.round(percent) + '%';
}

function updateWeeklyGraph(complaints) {
    if(!complaints || !complaints.length) return;
    
    // Get last 7 days (Mon-Sat or current week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0,0,0,0);
    
    const days = [];
    for(let i = 0; i < 6; i++) { // Mon to Sat
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    
    // Count filed & resolved per day
    const weekData = days.map(day => {
        const dayEnd = new Date(day);
        dayEnd.setHours(23,59,59,999);
        
        const filed = complaints.filter(c => {
            const d = new Date(c.createdAt);
            return d >= day && d <= dayEnd;
        }).length;
        
        const resolved = complaints.filter(c => {
            if(c.status !== 'resolved' || !c.timeline) return false;
            const resolvedEntry = c.timeline.find(t => t.status === 'resolved');
            if(!resolvedEntry || !resolvedEntry.time) return false;
            const d = new Date(resolvedEntry.time);
            return d >= day && d <= dayEnd;
        }).length;
        
        return { filed, resolved };
    });
    
    // Find max for percentage calculation
    const maxFiled = Math.max(...weekData.map(d => d.filed), 1);
    
    // Update chart bars
    const barGroups = document.querySelectorAll('.chart-bar-group');
    barGroups.forEach((group, i) => {
        if(i >= weekData.length) return;
        const data = weekData[i];
        const wrapper = group.querySelector('.chart-bar-wrapper');
        if(!wrapper) return;
        
        const filedBar = wrapper.querySelectorAll('.chart-bar')[0];
        const resolvedBar = wrapper.querySelectorAll('.chart-bar')[1];
        const filedVal = wrapper.querySelectorAll('.bar-value, .bar-value-sm')[0];
        const resolvedVal = wrapper.querySelectorAll('.bar-value, .bar-value-sm')[1];
        
        if(filedBar) filedBar.style.height = Math.max((data.filed / maxFiled) * 80, data.filed > 0 ? 8 : 0) + '%';
        if(resolvedBar) resolvedBar.style.height = Math.max((data.resolved / maxFiled) * 80, data.resolved > 0 ? 8 : 0) + '%';
        if(filedVal) filedVal.textContent = data.filed;
        if(resolvedVal) resolvedVal.textContent = data.resolved;
    });
    
    // Update summary
    const totalResolved = weekData.reduce((sum, d) => sum + d.resolved, 0);
    const avgPerDay = weekData.filter(d => d.resolved > 0).length > 0 
        ? Math.round(totalResolved / weekData.filter(d => d.resolved > 0).length) : 0;
    const summaryEl = document.querySelector('.chart-summary span');
    if(summaryEl) {
        summaryEl.textContent = currentLang === 'ta' 
            ? `📊 இந்த வாரம் ${totalResolved} தீர்வு | சராசரி ${avgPerDay}/நாள்`
            : `📊 This week ${totalResolved} resolved | Average ${avgPerDay}/day`;
    }
}

// ==================== DYNAMIC AREA & CATEGORY CHARTS ====================
function updateAreaChart(complaints) {
    if(!complaints || !complaints.length) return;
    const container = document.querySelector('.area-bars');
    if(!container) return;
    
    // Group by taluk (area) - normalize case to handle duplicates
    const areaCounts = {};
    complaints.forEach(c => {
        let area = c.taluk || c.district || 'Unknown';
        // Capitalize first letter of each word for consistency
        area = area.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
    
    // Sort by count descending, take top 6
    const sorted = Object.entries(areaCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    
    if(!sorted.length) return;
    const maxCount = sorted[0][1];
    
    // Color gradient from dark red (high) to light red (low)
    const colors = ['#c62828', '#d32f2f', '#e53935', '#ef5350', '#f44336', '#ff5252'];
    
    let html = '';
    sorted.forEach(([area, count], i) => {
        const widthPercent = Math.round((count / maxCount) * 100);
        const color = colors[i] || colors[colors.length - 1];
        html += `<div class="area-bar-item">
            <span class="area-bar-name">${area}</span>
            <div class="area-bar-track"><div class="area-bar-fill" style="width:${widthPercent}%;background:${color};"></div></div>
            <span class="area-bar-num">${count}</span>
        </div>`;
    });
    
    container.innerHTML = html;
}

function updateCategoryChart(complaints) {
    if(!complaints || !complaints.length) return;
    const container = document.querySelector('.category-list');
    if(!container) return;
    
    // Department config for icons and colors
    const deptConfig = {
        'roads': { icon: 'fa-road', color: '#c62828', nameTa: 'சாலைகள்', nameEn: 'Roads' },
        'water': { icon: 'fa-tint', color: '#1565c0', nameTa: 'குடிநீர்', nameEn: 'Water' },
        'tneb': { icon: 'fa-bolt', color: '#f57c00', nameTa: 'மின்சாரம்', nameEn: 'Electricity' },
        'health': { icon: 'fa-heartbeat', color: '#d32f2f', nameTa: 'சுகாதாரம்', nameEn: 'Health' },
        'revenue': { icon: 'fa-landmark', color: '#6a1b9a', nameTa: 'வருவாய்', nameEn: 'Revenue' }
    };
    
    // Group by department
    const deptCounts = {};
    complaints.forEach(c => {
        const dept = c.department || 'other';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    
    // Sort by count descending
    const sorted = Object.entries(deptCounts)
        .sort((a, b) => b[1] - a[1]);
    
    if(!sorted.length) return;
    const maxCount = sorted[0][1];
    
    let html = '';
    sorted.forEach(([dept, count]) => {
        const config = deptConfig[dept] || { icon: 'fa-folder', color: '#757575', nameTa: dept, nameEn: dept };
        const widthPercent = Math.round((count / maxCount) * 100);
        const name = currentLang === 'ta' ? config.nameTa : config.nameEn;
        html += `<div class="category-item">
            <i class="fas ${config.icon}" style="color:${config.color};"></i>
            <span class="cat-name">${name}</span>
            <span class="cat-num">${count}</span>
            <div class="cat-bar" style="width:${widthPercent}%;background:${config.color};"></div>
        </div>`;
    });
    
    container.innerHTML = html;
}

function renderDashList() {
    const container=document.getElementById('dashboard-complaints-list');
    const complaints=window._dashComplaints||[];
    if(!complaints.length){container.innerHTML=`<p style="color:#999;font-size:0.8rem;text-align:center;padding:30px;">No complaints</p>`;return;}
    let html='';
    complaints.forEach(c=>{
        const sl=statusLabels[c.status]?statusLabels[c.status][currentLang]:c.status;
        const sc=c.status==='in_progress'?'progress':c.status;
        const img=c.imageURL?`<img src="${c.imageURL}" style="width:80px;height:55px;object-fit:cover;border-radius:4px;margin-top:5px;border:1px solid #ddd;">`:'';
        const voice=c.voiceAttached?'<span style="background:#e8f5e9;padding:2px 6px;border-radius:4px;font-size:0.65rem;">🎤 Voice</span>':'';
        const gps=c.gpsLocation?`<br><span style="font-size:0.63rem;color:#0d7377;">📍 ${c.gpsLocation}</span>`:'';
        const desc=c.description?`<br><span style="font-size:0.65rem;color:#888;">💬 ${c.description.substring(0,60)}${c.description.length>60?'...':''}</span>`:'';
        html+=`<div class="dash-complaint-item" style="flex-wrap:wrap;gap:8px;">
            <div class="dash-complaint-left" style="min-width:0;">
                <span class="dash-complaint-num">${c.id} ${voice}</span>
                <span class="dash-complaint-title">👤 ${c.name||''} | 📱 ${c.mobile||''}</span>
                <span class="dash-complaint-dept">🏢 ${c.departmentName||''} - ${c.district||''}, ${c.taluk||''}${gps}${desc}</span>
                <span style="font-size:0.7rem;color:#333;font-weight:500;">📝 ${c.title||''}</span>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                <span class="complaint-status status-${sc}">${sl}</span>
                ${img}
            </div>
        </div>`;
    });
    container.innerHTML=html;
}

function populateActionSelect() {
    const select=document.getElementById('action-complaint-select');
    const complaints=(window._dashComplaints||[]).filter(c=>c.status!=='resolved');
    let opts='<option value="">-- Select --</option>';
    complaints.forEach(c=>{opts+=`<option value="${c.id}">${c.id} - ${c.title||''} (${c.district||''})</option>`;});
    select.innerHTML=opts;
    document.getElementById('action-complaint-detail').style.display='none';
}

async function loadComplaintForAction() {
    const id=document.getElementById('action-complaint-select').value;
    const detail=document.getElementById('action-complaint-detail');
    if(!id){detail.style.display='none';return;}
    const c=await getComplaintFromDB(id);
    if(!c)return;
    const info=document.getElementById('action-complaint-info');
    const img=c.imageURL?`<br><img src="${c.imageURL}" style="width:100%;max-height:100px;object-fit:cover;border-radius:6px;margin-top:5px;">`:'';
    const actionStreet=c.street?`<br>🏠 ${c.street}`:'';
    const actionPincode=c.pincode?` | 📮 ${c.pincode}`:'';
    info.innerHTML=`<strong>${c.id}</strong><br>👤 ${c.name} | 📱 ${c.mobile}<br>📍 ${c.district}, ${c.taluk}${actionStreet}${actionPincode}<br>📝 ${c.title}<br>🏢 ${currentLang==='ta'?c.assignedToTa:c.assignedTo}<br>📊 ${statusLabels[c.status][currentLang]}${c.voiceAttached?' | 🎤 Voice':''}${img}`;
    const cidx=statusFlow.indexOf(c.status);
    document.getElementById('action-new-status').value=statusFlow[Math.min(cidx+1,4)];
    detail.style.display='block';
}

async function updateComplaintStatus() {
    const id=document.getElementById('action-complaint-select').value;
    const newStatus=document.getElementById('action-new-status').value;
    const remarks=document.getElementById('action-remarks').value.trim()||(currentLang==='ta'?'அதிகாரி நிலை மாற்றம்':'Status updated by officer');
    if(!id)return;
    const c=await getComplaintFromDB(id);
    if(!c)return;
    const tl=[...(c.timeline||[]),{status:newStatus,time:getDateTimeStr(),note:remarks}];
    await updateComplaintInDB(id,{status:newStatus,timeline:tl});

    const sl=statusLabels[newStatus][currentLang];
    const sms=currentLang==='ta'
        ?`<strong>📱 To: ${c.mobile}</strong><br><br>புகார் #${id}<br>நிலை: <strong>${sl}</strong><br>துறை: ${c.departmentNameTa}<br>குறிப்பு: ${remarks}<br><br>- மக்கள் குறை தீர்ப்பு மேடை`
        :`<strong>📱 To: ${c.mobile}</strong><br><br>Complaint #${id}<br>Status: <strong>${sl}</strong><br>Dept: ${c.departmentName}<br>Remarks: ${remarks}<br><br>- Makkal Kurai Theerpu Medai`;
    document.getElementById('sms-popup-detail').innerHTML=sms;
    document.getElementById('sms-popup').style.display='flex';
    document.getElementById('action-remarks').value='';
    populateActionSelect();
}

function closeSMSPopup(){document.getElementById('sms-popup').style.display='none';}

// ==================== INPUT ====================
function handleKeyPress(e){if(e.key==='Enter')sendUserMessage();}
async function sendUserMessage(){
    const input=document.getElementById('user-input'); const text=input.value.trim(); if(!text)return;
    addMessage(text,'outgoing'); input.value='';
    
    // Restart chat
    if(text.toLowerCase()==='hi'||text==='வணக்கம்'){chatState='init';setTimeout(()=>startChat(),500);return;}
    
    // Check if it's a complaint number (starts with TN)
    if(text.toUpperCase().startsWith('TN')){
        addTypingIndicator();
        const c = await getComplaintFromDB(text.toUpperCase());
        removeTypingIndicator();
        if(c){
            const sl = statusLabels[c.status]?statusLabels[c.status][currentLang]:c.status;
            const cidx = statusFlow.indexOf(c.status);
            let statusBar = '';
            statusFlow.forEach((s,i)=>{
                const icon = i<cidx?'✅':i===cidx?'🔶':'⬜';
                statusBar += icon + ' ';
            });
            const imgLine = c.imageURL?`<br>📷 ${currentLang==='ta'?'படம் இணைக்கப்பட்டது':'Image attached'}`:'';
            const voiceLine = c.voiceAttached?`<br>🎤 ${currentLang==='ta'?'குரல் இணைப்பு':'Voice attached'}`:'';
            const gpsLine = c.gpsLocation?`<br>📍 ${c.gpsLocation}`:'';
            const lastUpdate = c.timeline && c.timeline.length>0 ? c.timeline[c.timeline.length-1] : null;
            const lastNote = lastUpdate && lastUpdate.note ? `<br>💬 ${lastUpdate.note}` : '';
            
            const streetLine = c.street?`<br>🏠 ${c.street}`:'';
            const pincodeLine = c.pincode?` - ${c.pincode}`:'';
            
            const reply = `📋 <strong>${c.id}</strong><br><br>` +
                `${statusBar}<br>` +
                `📊 ${currentLang==='ta'?'நிலை':'Status'}: <strong>${sl}</strong><br>` +
                `👤 ${c.name} | 📱 ${c.mobile}<br>` +
                `📍 ${c.district}, ${c.taluk}${streetLine}${pincodeLine}<br>` +
                `🏢 ${currentLang==='ta'?c.departmentNameTa:c.departmentName}<br>` +
                `📝 ${c.title}${gpsLine}${imgLine}${voiceLine}${lastNote}<br><br>` +
                `<small style="color:var(--text-muted)">${currentLang==='ta'?'புதிய புகார்: "Hi" | நிலை: Complaint ID அனுப்புங்கள்':'New complaint: "Hi" | Status: Send complaint ID'}</small>`;
            addMessage(reply,'incoming',true);
        } else {
            addMessage(currentLang==='ta'?`❌ "${text}" - புகார் எண் கிடைக்கவில்லை. சரியான எண்ணை உள்ளிடவும்.`:`❌ "${text}" - Complaint not found. Please check the number.`,'incoming',true);
        }
        return;
    }
    
    // Default reply
    addTypingIndicator();
    setTimeout(()=>{removeTypingIndicator();addMessage(currentLang==='ta'?'🙏 புதிய புகார்: "Hi" அனுப்புங்கள் | நிலை அறிய: Complaint ID (TN2024XXXXX) அனுப்புங்கள்':'🙏 New complaint: Send "Hi" | Track status: Send complaint ID (TN2024XXXXX)','incoming',true);},1000);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded',()=>{
    document.body.style.opacity='0';
    setTimeout(()=>{document.body.style.transition='opacity 0.4s';document.body.style.opacity='1';},50);
});
