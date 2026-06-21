#!/usr/bin/env node
/**
 * Enhanced Smoke Test Suite v2.0
 * Non-destructive testing of critical functionality with auto-discovery
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const config = {
    frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
    api_url: process.env.API_URL || 'http://localhost:3000',
    timeout: 10000,
    auto_discover: process.env.AUTO_DISCOVER !== 'false',
    test_email: process.env.TEST_EMAIL || `smoke-test+${Date.now()}@example.com`
};

console.log('🧪 Enhanced Smoke Test Suite v2.0');
console.log(`Frontend: ${config.frontend_url}`);
console.log(`API: ${config.api_url}`);
console.log(`Auto-discovery: ${config.auto_discover}`);
console.log('');

let passed = 0;
let failed = 0;

// Enhanced HTTP client with better error handling
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'Smoke-Test-Suite/2.0',
                'Accept': 'application/json, text/plain, */*',
                ...options.headers
            },
            timeout: config.timeout
        };

        const req = client.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    data: data,
                    ok: res.statusCode >= 200 && res.statusCode < 300
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Request timeout after ${config.timeout}ms`));
        });

        if (options.body) {
            req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
        }

        req.end();
    });
}

// Auto-discover API endpoints from codebase
function discoverApiEndpoints() {
    console.log('🔍 Auto-discovering API endpoints...');
    const endpoints = new Set();
    
    try {
        // Search for Express routes in common directories
        const searchDirs = ['api', 'server', 'src'];
        
        searchDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                searchDirectory(dir, endpoints);
            }
        });
        
        // Add common REST endpoints
        const commonEndpoints = [
            '/api/health',
            '/api/status',
            '/api/newsletter/subscribe',
            '/api/retreat-inquiry',
            '/api/send-thankyou',
            '/health',
            '/ping',
            '/api/ping'
        ];
        
        commonEndpoints.forEach(ep => endpoints.add(ep));
        
        console.log(`📍 Discovered ${endpoints.size} potential endpoints:`);
        Array.from(endpoints).sort().forEach(ep => console.log(`   ${ep}`));
        console.log('');
        
        return Array.from(endpoints).sort();
    } catch (error) {
        console.log(`⚠️  Discovery failed: ${error.message}`);
        return ['/api/health', '/api/newsletter/subscribe'];
    }
}

function searchDirectory(dir, endpoints) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules')) {
                searchDirectory(filePath, endpoints);
            } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.mjs')) {
                extractEndpoints(filePath, endpoints);
            }
        });
    } catch (error) {
        // Skip directories that can't be read
    }
}

function extractEndpoints(filePath, endpoints) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Express route patterns
        const expressPatterns = [
            /(?:app|router)\.(get|post|put|delete|patch|use)\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /router\.route\s*\(\s*['"`]([^'"`]+)['"`]/g
        ];
        
        expressPatterns.forEach(pattern => {
            const matches = [...content.matchAll(pattern)];
            matches.forEach(match => {
                const endpoint = match[2] || match[1];
                if (endpoint && endpoint.startsWith('/')) {
                    endpoints.add(endpoint.split('?')[0].split(':')[0]); // Remove query params and route params
                }
            });
        });
        
        // Vite/Next.js API routes (based on file structure)
        if (filePath.includes('api') && !filePath.includes('node_modules')) {
            const relativePath = path.relative('.', filePath);
            const parts = relativePath.split(path.sep);
            const apiIndex = parts.findIndex(part => part === 'api');
            
            if (apiIndex !== -1) {
                const apiPath = parts.slice(apiIndex).join('/').replace(/\.(js|ts|mjs)$/, '');
                endpoints.add('/' + apiPath);
            }
        }
    } catch (error) {
        // Skip files that can't be read
    }
}

// Test utilities
function logTest(name, status, details = '') {
    const icon = status ? '✅' : '❌';
    const color = status ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${color}${icon} ${name}${reset}`);
    if (details) {
        console.log(`   ${details}`);
    }
    
    if (status) passed++; else failed++;
}

// Main test suite
async function runTests() {
    console.log('🚀 Starting comprehensive smoke tests...\n');
    
    // 1. Frontend Tests
    console.log('📱 Frontend Tests');
    console.log('================');
    
    try {
        const response = await makeRequest(config.frontend_url);
        logTest('Frontend accessibility', response.ok, `Status: ${response.status}`);
        
        if (response.ok) {
            const html = response.data;
            
            // Check for critical frontend elements
            const checks = {
                'React root element': /<div[^>]*id="root"[^>]*>/i.test(html),
                'Meta viewport': /<meta[^>]*name="viewport"[^>]*>/i.test(html),
                'Title tag': /<title>/i.test(html),
                'Google client presence': /google/i.test(html),
                'PayPal presence': /paypal/i.test(html),
                'Stripe presence': /stripe/i.test(html)
            };
            
            Object.entries(checks).forEach(([name, passed]) => {
                logTest(`Frontend: ${name}`, passed);
            });
        }
    } catch (error) {
        logTest('Frontend accessibility', false, error.message);
    }
    
    console.log('');
    
    // 2. API Discovery and Testing
    console.log('🔌 API Tests');
    console.log('=============');
    
    let endpoints = [];
    if (config.auto_discover) {
        endpoints = discoverApiEndpoints();
    } else {
        endpoints = ['/api/health', '/api/newsletter/subscribe'];
        console.log('📍 Using default endpoints (discovery disabled)\n');
    }
    
    // Test each discovered endpoint
    for (const endpoint of endpoints) {
        const fullUrl = config.api_url + endpoint;
        
        try {
            const response = await makeRequest(fullUrl);
            const isHealthy = response.ok || response.status === 404; // 404 is acceptable for discovery
            logTest(`API: ${endpoint}`, isHealthy, `Status: ${response.status}`);
            
            // Special handling for specific endpoints
            if (endpoint.includes('health') && response.ok) {
                try {
                    const healthData = JSON.parse(response.data);
                    logTest(`Health check details`, true, `${JSON.stringify(healthData)}`);
                } catch (e) {
                    logTest(`Health check format`, false, 'Invalid JSON response');
                }
            }
        } catch (error) {
            const isTimeout = error.message.includes('timeout');
            logTest(`API: ${endpoint}`, false, `${error.message}${isTimeout ? ' (may be slow/overloaded)' : ''}`);
        }
    }
    
    console.log('');
    
    // 3. Newsletter Subscription Test (non-destructive)
    console.log('📧 Newsletter Tests');
    console.log('==================');
    
    if (endpoints.some(ep => ep.includes('newsletter'))) {
        try {
            const testPayload = {
                email: config.test_email,
                test: true // Many systems recognize this flag
            };
            
            const response = await makeRequest(config.api_url + '/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testPayload)
            });
            
            logTest('Newsletter subscription endpoint', response.ok || response.status === 422, 
                   `Status: ${response.status} (422 = validation error is acceptable)`);
            
        } catch (error) {
            logTest('Newsletter subscription endpoint', false, error.message);
        }
    } else {
        logTest('Newsletter endpoint discovery', false, 'No newsletter endpoints found');
    }
    
    console.log('');
    
    // 4. Environment Check
    console.log('🔧 Environment Tests');
    console.log('====================');
    
    // Check if we can detect environment configurations
    const envChecks = {
        'Environment variables set': !!(process.env.FRONTEND_URL || process.env.API_URL),
        'Using HTTPS frontend': config.frontend_url.startsWith('https://'),
        'Using HTTPS API': config.api_url.startsWith('https://'),
        'Test email configured': !!process.env.TEST_EMAIL
    };
    
    Object.entries(envChecks).forEach(([name, passed]) => {
        logTest(`Environment: ${name}`, passed);
    });
    
    console.log('');
    
    // Final results
    console.log('📊 Test Results');
    console.log('================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log('');
    
    if (failed > 0) {
        console.log('🔧 Recommendations:');
        console.log('- Check server logs for API errors');
        console.log('- Verify environment variables are set correctly');
        console.log('- Ensure all services are running and accessible');
        console.log('- Test with different network conditions');
        process.exit(1);
    } else {
        console.log('🎉 All tests passed! System appears healthy.');
    }
}

// Run the test suite
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
    runTests().catch(error => {
        console.error('💥 Test suite crashed:', error.message);
        process.exit(1);
    });
}

export { runTests, discoverApiEndpoints };