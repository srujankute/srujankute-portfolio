// assets/js/utils.js

// 1. MASTER DATABASE INITIAL SCHEMATICS
const DEFAULT_DATA = {
    profile: {
        name: "Srujan Kute",
        title: "Data Analyst",
        bio: "I turn raw numbers into clear business answers. I am an IT graduate specializing in writing clean SQL queries, processing data with Python, and designing sharp, interactive dashboards in PowerBI & Tableau.",
        resumeLink: "assets/pdf/Srujan_Kute_Data_Analyst.pdf",
        location: "Pune, India"
    },
    contact: {
        email: "srujankute@gmail.com",
        linkedin: "https://linkedin.com/in/srujankute",
        github: "https://github.com/srujankute"
    },
    skills: [
        { category: "Data Analysis", items: "Data Cleaning, Data Modelling, Data Visualization" },
        { category: "Data Visualization", items: "PowerBI, Tableau" },
        { category: "Automation", items: "Python, R" },
        { category: "Database", items: "MySQL, PostgreSQL" }
    ],
    projects: [
        { id: 2, title: "Vehicle Order Sales Analysis", desc: "Global vehicle order volumes, revenue distribution, and supply chain performance dashboard built using Power BI.", tech: "PowerBI, DAX Functions, Power Query", link: "https://github.com/srujankute/Vehicle-Order-Sales-Analysis-PowerBI-Practice" },
        { id: 1, title: "Netflix Dashboard", desc: "Interactive dashboard for analyzing Netflix content performance and viewer engagement.", tech: "PowerBI, DAX Functions, Power Query", link: "https://github.com/srujankute/netflix-dashboard-powerbi" },
        { id: 3, title: "VeriTrust AI", desc: "VeriTrust AI is a hybrid verification dashboard that cross-checks news claims against live global headlines using a machine learning Stacking Ensemble and SerpApi consensus logic.", tech: "Machine Learning, Flask Framework (Python), Frontend (HTML/CSS/JS), External APIs (SerpApi)", link: "https://github.com/srujankute/VeriTrust-AI" }
    ],
    certifications: [
        { id: 1, title: "Data Visualization with PowerBI", issuer: "Coding Ninjas", date: "2026-05-01", desc: "The course covered the full development lifecycle, starting with the heavy lifting in Power Query—cleaning messy data, handling nulls, and setting up proper ETL pipelines. From there, I got into data modeling and writing custom DAX expressions to handle complex calculations and time-intelligence metrics. Finally, I worked on the front-end side, building clean, interactive dashboards that actually make data easy to read and act on.", link: "https://certificate.codingninjas.com/view/1f4b73f718fcd629" }
    ],
    experiences: [
        { id: 1, role: "Data Analyst Intern", company: "Ventar", dates: "Oct 2025 - May 2026", achievements: "I worked as an IT Intern handling a mix of data analysis and software development. On the data side, I used Excel, Power BI, and Tableau to clean datasets, build dashboards, and help clients make data-driven decisions. At the same time, I jumped into development projects where I used frameworks like Laravel, Django, and Spring Boot to help build and maintain backend applications. It was a great split that let me work across the entire stack while seeing how data and software engineer together.", logo: "assets\\images\\WhatsApp Image 2026-06-04 at 12.28.10 AM.jpeg" }
    ]
};

// 2. STORAGE SYSTEM HANDLERS
function mergeArrayById(defaultArray, savedArray) {
    if (!Array.isArray(defaultArray)) return Array.isArray(savedArray) ? savedArray : [];
    if (!Array.isArray(savedArray)) return defaultArray;

    const savedIds = new Set(savedArray.filter(item => item && item.id !== undefined).map(item => item.id));
    const merged = [...savedArray];

    for (const item of defaultArray) {
        if (item && item.id !== undefined && !savedIds.has(item.id)) {
            merged.push(item);
        }
    }

    return merged;
}

function mergeDB(saved, defaults) {
    if (!saved || typeof saved !== "object") {
        return defaults;
    }

    return {
        ...defaults,
        ...saved,
        skills: Array.isArray(saved.skills) ? saved.skills : defaults.skills,
        projects: mergeArrayById(defaults.projects, saved.projects),
        certifications: mergeArrayById(defaults.certifications, saved.certifications),
        experiences: mergeArrayById(defaults.experiences, saved.experiences)
    };
}

function initDB() {
    const stored = localStorage.getItem("portfolio_db");
    if (!stored) {
        localStorage.setItem("portfolio_db", JSON.stringify(DEFAULT_DATA));
        return;
    }

    try {
        const parsed = JSON.parse(stored);
        const merged = mergeDB(parsed, DEFAULT_DATA);
        if (JSON.stringify(merged) !== JSON.stringify(parsed)) {
            localStorage.setItem("portfolio_db", JSON.stringify(merged));
        }
    } catch (err) {
        localStorage.setItem("portfolio_db", JSON.stringify(DEFAULT_DATA));
    }
}

function getDB() {
    initDB();
    return JSON.parse(localStorage.getItem("portfolio_db"));
}

function saveDB(data) {
    localStorage.setItem("portfolio_db", JSON.stringify(data));
}

// 3. SECURE AUTHENTICATION SYSTEM
const ADMIN_CREDENTIALS = { username: "Srujaannn", password: "Sruj@n27" };

function checkAuth() {
    const session = sessionStorage.getItem("admin_authenticated");
    const path = window.location.pathname;
    
    if (!session && path.includes("admin") && !path.includes("login.html")) {
        window.location.href = "login.html";
    }
}

function loginAdmin(user, pass) {
    if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem("admin_authenticated", "true");
        return true;
    }
    return false;
}

function logoutAdmin() {
    sessionStorage.removeItem("admin_authenticated");
    if (window.location.pathname.includes("admin")) {
        window.location.href = "../index.html";
    } else {
        window.location.href = "index.html";
    }
}

// 4. AUTOMATED COMPONENT INJECTOR ENGINE
async function includeComponents() {
    const isRoot = !window.location.pathname.includes("admin");
    const prefix = isRoot ? "" : "../";
    
    const components = [
        { id: "navbar-container", file: "components/navbar.html" },
        { id: "footer-container", file: "components/footer.html" }
    ];

    for (const comp of components) {
        const el = document.getElementById(comp.id);
        if (el) {
            try {
                const response = await fetch(`${prefix}${comp.file}`);
                if (response.ok) {
                    el.innerHTML = await response.text();
                    if (comp.id === "navbar-container") {
                        setActiveNavLink(prefix);
                        initNavbar();
                    }
                }
            } catch (err) {
                console.error(`Component load failed: ${comp.file}`, err);
            }
        }
    }
}

function initNavbar() {
    const toggle = document.getElementById("mobile-nav-toggle");
    const menu = document.getElementById("mobile-nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        const isHidden = menu.classList.contains("hidden");
        menu.classList.toggle("hidden", !isHidden);
        toggle.setAttribute("aria-expanded", String(isHidden));
    });

    document.addEventListener("click", (event) => {
        if (!menu.classList.contains("hidden") && !toggle.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.add("hidden");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

function setActiveNavLink(prefix) {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        let href = link.getAttribute('href');
        let checkHref = prefix === "" ? href : "admin/" + href;
        if (currentPath.includes(href) && !href.includes("index.html")) {
            link.classList.add('text-blue-400', 'border-b-2', 'border-blue-500');
        }
    });
}

// 5. BULLETPROOF PUBLIC DOM HYDRATION
function hydratePublicDOM() {
    const db = getDB();

    // -- INDEX PAGE --
    const heroName = document.getElementById("hero-name");
    if (heroName) {
        heroName.innerText = db.profile.name;
        document.getElementById("hero-title").innerText = db.profile.title;
        document.getElementById("hero-bio").innerText = db.profile.bio;
        document.getElementById("resume-btn").setAttribute("href", db.profile.resumeLink);
        
        const skillContainer = document.getElementById("dynamic-skills");
        if (skillContainer && db.skills) {
            skillContainer.innerHTML = db.skills.map(s => `
                <div class="p-5 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-blue-500/50 transition duration-300">
                    <h3 class="font-bold text-blue-400 text-lg">${s.category}</h3>
                    <p class="text-sm text-gray-400 mt-2">${s.items}</p>
                </div>
            `).join('');
        }
    }

    // -- PROJECTS PAGE --
    const targetProjects = document.getElementById("render-projects");
    if (targetProjects && db.projects) {
        targetProjects.innerHTML = db.projects.map(p => `
            <div class="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition duration-300 space-y-3">
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-bold text-white">${p.title}</h3>
                    <a href="${p.link}" target="_blank" class="text-sm text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1">Source <span class="text-lg">↗</span></a>
                </div>
                <p class="text-sm text-gray-400 font-light leading-relaxed">${p.desc}</p>
                <div class="inline-block mt-2 px-3 py-1 bg-blue-950/50 text-blue-400 text-xs font-mono rounded border border-blue-900/50">${p.tech}</div>
            </div>
        `).join('');
    }

    // -- CERTIFICATIONS PAGE --
    const targetCerts = document.getElementById("render-certs");
    if (targetCerts && db.certifications) {
        targetCerts.innerHTML = db.certifications.map(c => `
            <div class="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition duration-300 space-y-3 flex flex-col">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-mono text-gray-500 uppercase tracking-wider">${c.issuer}</span>
                    <span class="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded">${c.date}</span>
                </div>
                <h3 class="text-xl font-bold text-white">${c.title}</h3>
                <p class="text-sm text-gray-400 font-light flex-grow">${c.desc}</p>
                <a href="${c.link}" target="_blank" class="inline-block text-sm text-blue-400 hover:text-blue-300 font-medium pt-2">Verify Credential &rarr;</a>
            </div>
        `).join('');
    }

    // -- EXPERIENCE PAGE --
    const targetExp = document.getElementById("render-experience");
    if (targetExp && db.experiences) {
        targetExp.innerHTML = db.experiences.map(e => `
            <div class="flex flex-col md:flex-row gap-6 p-6 bg-gray-900/60 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition duration-300">
                <div class="flex-shrink-0">
                    <img src="${e.logo || 'https://via.placeholder.com/64'}" class="w-16 h-16 rounded-xl bg-gray-800 object-cover border border-gray-700" alt="${e.company} logo">
                </div>
                <div class="space-y-2 w-full">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <h3 class="text-xl font-bold text-white">${e.role}</h3>
                            <p class="text-md text-blue-400 font-medium">${e.company}</p>
                        </div>
                        <span class="text-xs text-gray-400 font-mono bg-gray-950 px-3 py-1 rounded-full border border-gray-800 whitespace-nowrap">${e.dates}</span>
                    </div>
                    <p class="text-sm text-gray-400 font-light pt-2 whitespace-pre-line leading-relaxed">${e.achievements}</p>
                </div>
            </div>
        `).join('');
    }

    // -- CONTACT PAGE --
    const ctxEmail = document.getElementById("ctx-email-text");
    if (ctxEmail) {
        ctxEmail.innerText = db.contact.email;
        document.getElementById("ctx-email-link").setAttribute("href", `mailto:${db.contact.email}`);
        document.getElementById("ctx-linkedin").setAttribute("href", db.contact.linkedin);
        document.getElementById("ctx-github").setAttribute("href", db.contact.github);
        document.getElementById("ctx-location").innerHTML = `📍 <strong>${db.profile.location}</strong>`;
    }
}

// 6. GLOBAL STARTUP
document.addEventListener("DOMContentLoaded", () => {
    initDB();
    checkAuth();
    includeComponents();
    hydratePublicDOM();
});