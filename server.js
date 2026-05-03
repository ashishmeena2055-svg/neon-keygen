const express = require('express');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CRITICAL FIX: Yeh line "Cannot GET /" ko theek karegi
// Yeh server ko batata hai ki index.html kahan hai
app.use(express.static(path.join(__dirname, 'public')));

const jobs = new Map();

// Root Route: Agar static fail ho toh ye kaam karega
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Baaki ka Automation Logic (Same as before) ---
app.post('/api/automate', (req, res) => {
    const { targetUrl } = req.body;
    const jobId = 'NEON_' + Math.random().toString(36).substr(2, 5).toUpperCase();
    jobs.set(jobId, { status: '⚡ INITIALIZING', url: null });
    runAutomation(jobId, targetUrl);
    res.json({ success: true, jobId });
});

app.get('/api/status/:id', (req, res) => {
    res.json(jobs.get(req.params.id) || { status: 'NOT_FOUND' });
});

async function runAutomation(jobId, targetUrl) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; SM-X216B) AppleWebKit/537.36');
        
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Simulation Logic (Waiters & Clickers)
        for (let i = 1; i <= 3; i++) {
            jobs.set(jobId, { status: `🔓 BYPASSING LAYER ${i}` });
            await page.evaluate(() => window.scrollBy(0, 500));
            await new Promise(r => setTimeout(r, 18500));
            // Add click logic here
        }
        
        jobs.set(jobId, { status: 'SUCCESS', url: page.url() });
    } catch (e) {
        jobs.set(jobId, { status: 'FAILED', error: e.message });
    } finally {
        if (browser) await browser.close();
    }
}

app.listen(process.env.PORT || 3000, "0.0.0.0");
