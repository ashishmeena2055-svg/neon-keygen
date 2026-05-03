const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const cors = require('cors');

puppeteer.use(StealthPlugin());
const app = express();
app.use(cors());
app.use(express.json());

const jobs = new Map();

// Step 1: Start Automation (Immediate Response to prevent 502)
app.post('/api/automate', (req, res) => {
    const { targetUrl } = req.body;
    const jobId = 'NEON_' + Math.random().toString(36).substr(2, 7).toUpperCase();
    jobs.set(jobId, { status: '⚡ INITIALIZING', url: null });
    
    // Background execution
    runAutomation(jobId, targetUrl);
    res.json({ success: true, jobId });
});

// Step 2: Check Status (Polling)
app.get('/api/status/:id', (req, res) => {
    res.json(jobs.get(req.params.id) || { status: 'NOT_FOUND' });
});

async function runAutomation(jobId, targetUrl) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; SM-X216B) AppleWebKit/537.36');
        
        jobs.set(jobId, { status: '🌐 NAVIGATING...' });
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        for (let i = 1; i <= 3; i++) {
            jobs.set(jobId, { status: `🔓 BYPASSING LAYER ${i} (WAITING 18S)` });
            
            const clicked = await page.evaluate(() => {
                const terms = ['verify', 'continue', 'next', 'get link', 'generate'];
                const btn = Array.from(document.querySelectorAll('button, a, div, span'))
                                 .find(el => terms.some(t => el.innerText.toLowerCase().includes(t)));
                if (btn) { btn.click(); return true; }
                return false;
            });

            if (clicked) {
                await new Promise(r => setTimeout(r, 18500));
            } else {
                await page.evaluate(() => window.scrollBy(0, 500));
            }
        }

        jobs.set(jobId, { status: 'SUCCESS', url: page.url() });

    } catch (e) {
        jobs.set(jobId, { status: 'FAILED', error: e.message });
    } finally {
        if (browser) await browser.close();
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log('NEON CORE ACTIVE'));
