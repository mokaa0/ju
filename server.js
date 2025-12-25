import puppeteer from 'puppeteer-extra';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import axios from 'axios';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'crypto';
import { uniqueNamesGenerator, adjectives, colors, animals} from 'unique-names-generator';
import chalk from 'chalk';
import crypto from 'crypto';

const database = JSON.parse(fs.readFileSync('data.json', 'utf-8'));


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const BRAVE_EXECUTABLE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'; 



// Plugins

console.clear();  // Clears the terminal screen at the start
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function centerText(text) {
    const width = process.stdout.columns || 80; // Default to 80 if width is unknown
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(padding) + text;
}
async function readJsonFile() {
    try {
      const data = await fs.readFile('data.json', 'utf8');
      return JSON.parse(data); // Return parsed object
    } catch (err) {
      throw err; // Throw error if read or parse fails
    }
  }
const title = "Discord Token Generator By rabea";
console.log(chalk.green.bold(centerText(title)));
console.log("\n"); // Adds an empty line below the title

await new Promise(resolve => setTimeout(resolve, 1000));
async function humanizedMouseMoveAndClick(page, targetX, targetY) {
    // Get the current mouse position
    const startX = 0; // Start from the top-left corner
    const startY = 0;
  
    // Move the mouse gradually to the target coordinates
    await moveMouse(page, startX, startY, targetX, targetY);
  
    // Add a small delay before clicking
    await new Promise((resolve) => setTimeout(resolve,(getRandomDelay(100, 300)))); // Random delay between 100ms and 300ms
  
    // Perform the click
    await page.mouse.click(targetX, targetY);
  }
  
  /**
   * Helper function to move the mouse gradually
   * @param {Page} page - Puppeteer page object
   * @param {number} startX - Starting X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} targetX - Target X coordinate
   * @param {number} targetY - Target Y coordinate
   */
  async function moveMouse(page, startX, startY, targetX, targetY) {
    const steps = 20; // Number of steps to reach the target
    const stepX = (targetX - startX) / steps;
    const stepY = (targetY - startY) / steps;
  
    for (let i = 0; i < steps; i++) {
      const currentX = startX + stepX * i;
      const currentY = startY + stepY * i;
  
      // Move the mouse to the current position
      await page.mouse.move(currentX, currentY);
  
      // Add a small random delay between steps
      await new Promise((resolve) => setTimeout(resolve,(getRandomDelay(50, 150)))); // Random delay between 50ms and 150ms
    }
  }
async function fill_input(page, selectorType, selector, info) {
    let inputField;
  
    if (selectorType === 'css') {
      // Use the CSS selector
      inputField = await page.$(selector);
    } else if (selectorType === 'xpath') {
      // Use XPath
      const elements = await page.$x(selector);
      inputField = elements[0]; // Assuming the XPath matches a single element
    }
  
    if (inputField) {
      await inputField.focus();
      await page.keyboard.type(info);
    } else {
      console.error(chalk.red.bold(Input field with ${selectorType} selector "${selector}" not found.));
    }
  }
  
function encode(data, password) {
    const salt = randomBytes(16);
    const key = pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = randomBytes(16);

    const cipher = createCipheriv('aes-256-cbc', key, iv);

    const blockSize = 16;
    const padding = blockSize - (Buffer.byteLength(data) % blockSize);
    const paddedData = Buffer.concat([Buffer.from(data), Buffer.alloc(padding, ' ')]);

    const encrypted = Buffer.concat([cipher.update(paddedData), cipher.final()]);

    return Buffer.concat([salt, iv, encrypted]).toString('base64');
}
function decryptText(encryptedText) {
    const key = crypto.createHash("sha256").update("SuperRab1234@").digest();
    const encryptedData = Buffer.from(encryptedText, "base64");
    const iv = encryptedData.slice(0, 12);
    const cipherText = encryptedData.slice(12);
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(cipherText.slice(-16));
    
    const decrypted = Buffer.concat([
        decipher.update(cipherText.slice(0, -16)),
        decipher.final()
    ]);
    
    return decrypted.toString("utf8");
}
function getHWID() {
    try {
        const hwid = execSync('powershell -Command "(Get-WmiObject Win32_ComputerSystemProduct).UUID"')
            .toString().trim();

        if (!hwid) {
            throw new Error("HWID retrieval returned empty value.");
        }

        console.log("     | " + chalk.green.bold("HWID:", hwid));
                     

        return hwid;
    } catch (error) {
        console.error(chalk.red.bold("Error fetching HWID:", error));
        process.exit(1);
    }
}
async function Captcha_Solve(page, database) {
    async function safeWaitForSelector(selector, timeout = 5000) {
        try {
            console.log(Waiting for selector: ${selector});
            const element = await page.waitForSelector(selector, { timeout });
            console.log(Found selector: ${selector});
            return element;
        } catch (error) {
            console.error(Error waiting for selector ${selector}:, error);
            return null; // Ensures function continues
        }
    }

    // Helper function to click an element with retries
    async function clickWithRetry(frame, selector, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const element = await frame.waitForSelector(selector, { timeout: 5000 });
                await element.evaluate(el => el.scrollIntoView()); // Ensure element is in view
                await element.hover(); // Ensure element is not blocked
                await element.click();
                console.log(Clicked selector: ${selector});
                return; // Success
            } catch (error) {
                console.warn(Attempt ${i + 1} failed for selector ${selector}:, error.message);
                if (i === retries - 1) throw error; // Throw error on last attempt
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
            }
        }
    }

    const checkboxFrameEl = await safeWaitForSelector('iframe[title*="checkbox for hCaptcha"]');
    if (checkboxFrameEl) {
        const checkboxFrame = await checkboxFrameEl.contentFrame();
        if (checkboxFrame) {
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(1500, 2000)));
            await clickWithRetry(checkboxFrame, 'div[id="checkbox"]');
        }
    } else {
        console.log("Skipping checkbox interaction...");
    }

    console.log("Proceeding to the challenge iframe...");
    // Step 2: Interact with the challenge iframe
    const challengeFrameEl = await safeWaitForSelector('iframe[title*="hCaptcha challenge"]');
    if (challengeFrameEl) {
        const challengeFrame = await challengeFrameEl.contentFrame();
        if (challengeFrame) {
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 1250)));
            await clickWithRetry(challengeFrame, 'div[class="display-language button"]');
            await page.keyboard.press('a');
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1250)));
            const options = await challengeFrame.$$('div[class="option"]')
            await options[3].click();
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 2300)));
            while (true) {
                try {
                    const e1 = await challengeFrame.waitForSelector('div[id="menu-info"]', { timeout: 1000 })
                    await e1.click();
                    await new Promise(resolve => setTimeout(resolve, getRandomDelay(100, 300)));
                    const e2 = await challengeFrame.waitForSelector('div[id="text_challenge"]', { timeout: 1000 })
                    await e2.click();
                    break
                } catch {}}
            await new Promise(resolve => setTimeout(resolve, 500));
            while (true) {
                try {
                    const element = await challengeFrame.waitForSelector('div[class="challenge-text"]', { timeout: 5000 });
                    const ask = element ? await element.evaluate(el => el.textContent.trim()) : null;

                    // Determine the answer
                    const answer = database.hasOwnProperty(ask) ? database[ask] : '??';

                    await new Promise(resolve => setTimeout(resolve, getRandomDelay(100, 300)));
                    const captchaInput = await challengeFrame.waitForSelector('[name="captcha"]', { timeout: 5000 });
                    if (captchaInput) {
                        await captchaInput.focus();
                        await captchaInput.type(answer);
                    }
                    //await page.keyboard.press('Enter');

                    // const targetX = 850;
                    // const targetY = 505;
                    // await page.mouse.click(targetX,targetY)
                    //await humanizedMouseMoveAndClick(page,targetX,targetY)
                    await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 1500)));

                } catch (error) {
                    console.error("Error in solveCaptcha loop:", error);
                    return; // Exit the function if an error occurs
                }
            }
        }
    } else {
        console.log("Skipping challenge interaction...");
    }
    console.log("Captcha_Solve function completed.");
}



async function getDiscordToken(,database) {
    let browser;
    try {
        browser = await puppeteer.launch(BROWSER_CONFIG);
        const page = await browser.newPage();
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });
        const server_code = ["midjourney","ho","hos","support","minecraft","valorant","csgo","lol","ln","po","rocketleague","genshinimpact","osu","arena","terraria","memeology","rust","fivem","roblox","fortnite","marvel","honkai","destiny","overwatch","limewire","operagx","chrome","google","apple","newegg","machine"][Math.floor(Math.random() * 31)];
        await page.goto(https://discord.com/invite/${server_code}, { waitUntil: 'networkidle2' });

     
            Object.defineProperty(window, 'localStorage', getLocalStoragePropertyDescriptor());
            window.localStorage.setItem('', '"${}"');
        ;
        await page.evaluate();
        await page.reload();
        await new Promise(resolve => setTimeout(resolve, 1500));
        const username = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 2});
        
        console.log(     | ${chalk.green.bold("Generated Name:")} ${chalk.green.bold(username)});

        
        // Find the input field and type the generated name into it
        await fill_input(page, 'css', 'input[name="global_name"]', username);
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
            await page.click('button[type="submit"]');
            // console.log('Register button clicked successfully.');
        } catch (error) {
            console.error(chalk.red.bold('Error clicking the register button:', error.message));
        }            
        //await Captcha_Solve(page,database);
        const client = await page.target().createCDPSession();
        await client.send('Network.enable');

        let token;
        client.on('Network.webSocketFrameSent', ({ response }) => {
            try {
                const json = JSON.parse(response.payloadData);
                if (!token && json?.d?.token) {
                    token = json.d.token;
                    console.log(     | ${chalk.green.bold("Token Has Been Saved to the file")});

                }
            } catch (e) {
                console.error(chalk.red.bold('Error parsing WebSocket frame:', e.message));
            }
        });

        console.log('     | ' + chalk.red.bold('Please Solve the H-Captcha Manually'));

        const maxWaitTime = 120000;
        const pollInterval = 1500;
        const startTime = Date.now();

        while (!token && Date.now() - startTime < maxWaitTime) {
            console.log('     | ' + chalk.yellow.bold('Waiting for token ...'));
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        if (!token) {
            console.warn(chalk.red.bold('Token not found after waiting. You may need to manually retrieve it.'));
            token = 'undefined';
        }

        return token;
    } catch (error) {
        console.error(chalk.red.bold("Error in getDiscordToken:", error.message));
    } finally {
        if (browser) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await browser.close(); // Close the browser after the task is complete
        }
    }
}


let goodCount = 0;
let notgoodCount = 0;
(async () => {
    const hwid = getHWID();

    if (!hwid) {
        console.error("Failed to retrieve HWID. Exiting...");
        return;
    }

    while (true) {
        try {
            if () {
                let token = await getDiscordToken(,database);

                if (token) {
                    const encodedToken = encode(token, "SuSuperaRabeaasds1234@");
                    let status;
                    let logMessage; // Declare logMessage in the outer scope

                    if (token.slice(0, 3) === "MTI") {
                        status = "Good";
                        goodCount++;
                        logMessage = chalk.white(     | ) + chalk.green.bold(${status} Token ${goodCount} Has Been Created);
                        fs.appendFileSync('Unclaimed.txt', encodedToken + \n, 'utf-8');
                    } else {
                        status = "Not Good";
                        notgoodCount++;
                        logMessage = chalk.white(     | ) + chalk.red.bold(${status} Token ${notgoodCount} Has Been Created);
                        const SERVER_IP = "45.88.9.135:9000"
                        await axios.get(http://${SERVER_IP}/not_good, {
                            params: { MUSLIM: "True" }
                        });
                        fs.appendFileSync('Not Good.txt', encodedToken + \n, 'utf-8');
                    }

                    console.log(logMessage); // Now logMessage is correctly defined
                } else {
                    console.log("Failed to retrieve token.");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();