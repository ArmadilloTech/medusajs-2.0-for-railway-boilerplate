import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Get query service to fetch locations
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    
    // Fetch all locations from the database
    const { data: locations } = await query.graph({
      entity: "stock_location",
      fields: [
        "id",
        "name"
      ]
    });
    
    // Generate location options HTML
    const locationOptions = locations?.map(location => 
      `<option value="${location.id}">${location.name}</option>`
    ).join('') || '';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Scanner - Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 20px;
            height: 100vh;
        }
        
        .scanner-panel {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .logs-panel {
            background: white;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow-y: auto;
            backdrop-filter: blur(10px);
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            text-align: center;
        }
        
        .input-group {
            margin-bottom: 24px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        input, select {
            width: 100%;
            padding: 16px;
            border: 2px solid #e1e5e9;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .scan-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 18px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .scan-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .scan-button:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .logs-title {
            font-size: 20px;
            margin-bottom: 15px;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .log-entry {
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            background: #f8f9fa;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .log-entry:hover {
            transform: translateX(4px);
        }
        
        .log-entry.success {
            border-left-color: #28a745;
            background: #d4edda;
        }
        
        .log-entry.error {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        
        .log-entry.warning {
            border-left-color: #ffc107;
            background: #fff3cd;
        }
        
        .log-entry.reverted {
            border-left-color: #6c757d;
            background: #e9ecef;
            opacity: 0.7;
        }
        
        .log-time {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .log-message {
            font-weight: 600;
        }
        
        .log-details {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        
        .undo-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
        }
        
        .undo-button:hover {
            opacity: 1;
            background: #c82333;
            transform: scale(1.05);
        }
        
        .undo-button:disabled {
            background: #6c757d;
            cursor: not-allowed;
            opacity: 0.5;
        }
        
        .log-entry.success .undo-button {
            display: block;
        }
        
        .log-entry.reverted .undo-button {
            display: none;
        }
        
        .clear-logs {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        
        .clear-logs:hover {
            background: #545b62;
            transform: translateY(-1px);
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .status-ready { background: #28a745; }
        .status-scanning { background: #ffc107; animation: spin 1s linear infinite; }
        .status-error { background: #dc3545; }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .admin-header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .back-to-admin {
            display: inline-block;
            background: #6c757d;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .back-to-admin:hover {
            background: #545b62;
            transform: translateY(-1px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }
        
        .instructions {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        
        .instructions strong {
            color: #2c3e50;
            font-size: 16px;
        }
        
        .instructions ul {
            margin-top: 12px;
            margin-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 6px;
            color: #555;
        }
        
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: 700;
        }
        
        .stat-label {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="scanner-panel">
            <a href="/app" class="back-to-admin">← Back to Admin</a>
            
            <div class="admin-header">
                🔐 Admin Scanner - Inventory Management
            </div>
            
            <h1>📦 Inventory Scanner</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalScans">0</div>
                    <div class="stat-label">Total Scans</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="successfulScans">0</div>
                    <div class="stat-label">Successful</div>
                </div>
            </div>
            
            <div class="input-group">
                <label for="location">Location:</label>
                <select id="location">
                    ${locationOptions}
                </select>
            </div>
            
            <div class="input-group">
                <label for="sku">Scan SKU:</label>
                <input type="text" id="sku" placeholder="Scan or enter SKU..." autocomplete="off">
            </div>
            
            <button class="scan-button" id="scanBtn" onclick="scanItem()">
                <span class="status-indicator status-ready"></span>
                Scan Item
            </button>
            
            <div class="instructions">
                <strong>Instructions:</strong>
                <ul>
                    <li>Select the location above</li>
                    <li>Scan or type the SKU</li>
                    <li>Click "Scan Item" or press Enter</li>
                    <li>Item will be decremented by 1</li>
                </ul>
            </div>
        </div>
        
        <div class="logs-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 class="logs-title">📋 Scan Logs</h2>
                <button class="clear-logs" onclick="clearLogs()">Clear</button>
            </div>
            <div id="logs"></div>
        </div>
    </div>

    <script>
        let isScanning = false;
        let totalScans = 0;
        let successfulScans = 0;
        let scanHistory = []; // Store scan data for reverting
        let currentScanBuffer = ''; // Buffer for collecting scan data
        let scanTimeout = null; // Timeout for detecting end of scan
        
        // Focus on SKU input when page loads
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('sku').focus();
        });
        
        // Global keypress listener for barcode scanning
        document.addEventListener('keypress', function(e) {
            // Ignore if we're typing in the SKU input field
            if (e.target.id === 'sku') {
                return;
            }
            
            // Ignore if we're in any input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }
            
            // Handle Enter key as end of scan
            if (e.key === 'Enter' || e.key === '\\r' || e.key === '\\n') {
                if (currentScanBuffer.length > 0) {
                    const cleanScan = currentScanBuffer.trim();
                    if (cleanScan.length > 0) {
                        console.log('Global scan detected:', cleanScan);
                        processGlobalScan(cleanScan);
                    }
                    currentScanBuffer = '';
                }
                return;
            }
            
            // Add character to buffer (excluding Enter keys)
            currentScanBuffer += e.key;
        });
        
        // Also listen for keydown to catch Enter keys that might not trigger keypress
        document.addEventListener('keydown', function(e) {
            // Only handle Enter keys when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }
            
            if (e.key === 'Enter' || e.key === '\\r' || e.key === '\\n') {
                if (currentScanBuffer.length > 0) {
                    const cleanScan = currentScanBuffer.trim();
                    if (cleanScan.length > 0) {
                        console.log('Global scan detected (keydown):', cleanScan);
                        processGlobalScan(cleanScan);
                    }
                    currentScanBuffer = '';
                }
                e.preventDefault(); // Prevent default Enter behavior
            }
        });
        
        // Handle Enter key in SKU input
        document.getElementById('sku').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !isScanning) {
                e.preventDefault();
                scanItem();
            }
        });
        
        function updateStats() {
            document.getElementById('totalScans').textContent = totalScans;
            document.getElementById('successfulScans').textContent = successfulScans;
        }
        
        function addLog(message, type = 'info', details = '', scanData = null) {
            const logs = document.getElementById('logs');
            const logEntry = document.createElement('div');
            logEntry.className = \`log-entry \${type}\`;
            
            const time = new Date().toLocaleTimeString();
            const logId = Date.now() + Math.random().toString(36).substr(2, 9);
            
            let undoButton = '';
            if ((type === 'success' || type === 'error') && scanData && scanData.logId) {
                undoButton = \`<button class="undo-button" onclick="revertScan('\${logId}')" title="Undo this scan">↶ Undo</button>\`;
                // Store scan data for undoing
                scanHistory.push({
                    id: logId,
                    ...scanData
                });
            }
            
            logEntry.innerHTML = \`
                \${undoButton}
                <div class="log-time">\${time}</div>
                <div class="log-message">\${message}</div>
                \${details ? \`<div class="log-details">\${details}</div>\` : ''}
            \`;
            
            logEntry.id = logId;
            logs.insertBefore(logEntry, logs.firstChild);
            
            // Keep only last 50 logs
            while (logs.children.length > 50) {
                logs.removeChild(logs.lastChild);
            }
        }
        
        async function revertScan(logId) {
            const scanData = scanHistory.find(scan => scan.id === logId);
            if (!scanData) {
                addLog('Could not find scan data to revert', 'error');
                return;
            }
            
            const logEntry = document.getElementById(logId);
            const revertButton = logEntry ? logEntry.querySelector('.undo-button') : null;
            if (revertButton) {
                revertButton.disabled = true;
                revertButton.textContent = 'Undoing...';
            }
            
            try {
                // Call the undo API
                const response = await fetch('/store/scanner/undo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-publishable-api-key': 'pk_d1bfd3f75d95be71ad95f1bd2ddffe7f026185ec356858095bff226571b3675b'
                    },
                    body: JSON.stringify({
                        logId: scanData.logId // Pass the database log ID
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Remove the log entry completely since it's deleted from database
                    if (logEntry) {
                        logEntry.remove();
                    }
                    
                    addLog(\`✅ Undone scan for \${scanData.sku}\`, 'success', \`Quantity restored to \${scanData.previousQuantity} and log removed\`);
                    
                    // Remove from scan history
                    scanHistory = scanHistory.filter(scan => scan.id !== logId);
                    
                    // Update stats
                    successfulScans = Math.max(0, successfulScans - 1);
                    totalScans = Math.max(0, totalScans - 1);
                    updateStats();
                    
                } else {
                    addLog(\`❌ Failed to undo: \${result.message}\`, 'error');
                    if (revertButton) {
                        revertButton.disabled = false;
                        revertButton.textContent = '↶ Undo';
                    }
                }
                
            } catch (error) {
                addLog(\`❌ Error undoing scan: \${error.message}\`, 'error');
                if (revertButton) {
                    revertButton.disabled = false;
                    revertButton.textContent = '↶ Undo';
                }
            }
        }
        
        function clearLogs() {
            document.getElementById('logs').innerHTML = '';
            scanHistory = []; // Clear scan history when logs are cleared
            totalScans = 0;
            successfulScans = 0;
            updateStats();
            
            // Clear logs from database
            fetch('/store/scanner/logs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': 'pk_d1bfd3f75d95be71ad95f1bd2ddffe7f026185ec356858095bff226571b3675b'
                }
            }).then(response => response.json())
            .then(result => {
                if (result.success) {
                    addLog('🗑️ All scan logs cleared from database', 'info');
                } else {
                    addLog('❌ Failed to clear logs from database', 'error');
                }
            }).catch(error => {
                addLog(\`❌ Error clearing logs: \${error.message}\`, 'error');
            });
        }
        
        function setScanningStatus(status) {
            const btn = document.getElementById('scanBtn');
            const indicator = btn.querySelector('.status-indicator');
            
            isScanning = status === 'scanning';
            btn.disabled = isScanning;
            
            // Remove all status classes
            indicator.classList.remove('status-ready', 'status-scanning', 'status-error');
            
            if (status === 'scanning') {
                indicator.classList.add('status-scanning');
                btn.innerHTML = '<span class="status-indicator status-scanning"></span>Scanning...';
            } else if (status === 'error') {
                indicator.classList.add('status-error');
                btn.innerHTML = '<span class="status-indicator status-error"></span>Error - Try Again';
                setTimeout(() => {
                    indicator.classList.remove('status-error');
                    indicator.classList.add('status-ready');
                    btn.innerHTML = '<span class="status-indicator status-ready"></span>Scan Item';
                    btn.disabled = false;
                }, 3000);
            } else {
                indicator.classList.add('status-ready');
                btn.innerHTML = '<span class="status-indicator status-ready"></span>Scan Item';
            }
        }
        
        async function scanItem() {
            const sku = document.getElementById('sku').value.trim();
            const location = document.getElementById('location').value;
            
            if (!sku) {
                addLog('Please enter a SKU', 'error');
                return;
            }
            
            if (!location) {
                addLog('Please select a location', 'error');
                return;
            }
            
            setScanningStatus('scanning');
            addLog(\`Scanning SKU: \${sku}\`, 'info');
            totalScans++;
            updateStats();
            
            try {
                const response = await fetch('/store/scanner?sku=' + encodeURIComponent(sku) + '&locationId=' + encodeURIComponent(location), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-publishable-api-key': 'pk_d1bfd3f75d95be71ad95f1bd2ddffe7f026185ec356858095bff226571b3675b'
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    addLog(
                        \`✅ \${result.product.title}\`, 
                        'success',
                        \`SKU: \${result.product.sku} | Previous: \${result.product.previousQuantity} | Current: \${result.product.currentQuantity}\`,
                        {
                            sku: result.product.sku,
                            locationId: location,
                            previousQuantity: result.product.previousQuantity,
                            currentQuantity: result.product.currentQuantity,
                            productTitle: result.product.title,
                            logId: result.logId
                        }
                    );
                    successfulScans++;
                    updateStats();
                    setScanningStatus('ready');
                } else {
                    addLog(\`❌ \${result.message}\`, 'error', '', {
                        logId: result.logId
                    });
                    setScanningStatus('error');
                }
                
            } catch (error) {
                addLog(\`❌ Error: \${error.message}\`, 'error');
                setScanningStatus('error');
            }
            
            // Clear input and focus for next scan
            document.getElementById('sku').value = '';
            document.getElementById('sku').focus();
        }
        
        // Process scan from global listener
        function processGlobalScan(sku) {
            if (isScanning) {
                addLog('Already processing a scan, please wait...', 'warning');
                return;
            }
            
            // Set the SKU in the input field for visual feedback
            document.getElementById('sku').value = sku;
            
            // Add a visual indicator that global scan was detected
            addLog(\`📱 Global scan detected: \${sku}\`, 'info');
            
            // Process the scan
            scanItem();
        }
        
        // Add initial log
        addLog('Admin scanner ready - Global scanning enabled', 'success');
        
        // Load existing scan logs from database
        loadScanLogs();
        
        async function loadScanLogs() {
            try {
                const response = await fetch('/store/scanner/logs?limit=50', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-publishable-api-key': 'pk_d1bfd3f75d95be71ad95f1bd2ddffe7f026185ec356858095bff226571b3675b'
                    }
                });
                
                const result = await response.json();
                
                if (result.success && result.logs) {
                    // Clear existing logs
                    document.getElementById('logs').innerHTML = '';
                    scanHistory = [];
                    
                    if (result.logs.length === 0) {
                        addLog('No scan logs found in database', 'info');
                        return;
                    }
                    
                    // Add logs from database (in reverse order since they're already sorted desc)
                    result.logs.reverse().forEach(log => {
                        const logType = log.success ? 'success' : 'error';
                        const details = log.success ? 
                            \`SKU: \${log.sku} | Previous: \${log.previousQuantity} | Current: \${log.currentQuantity} | Location: \${log.locationName}\` : 
                            log.message;
                        
                        addLog(
                            log.success ? \`✅ \${log.productTitle}\` : 
                            \`❌ \${log.message}\`,
                            logType,
                            details,
                            log.success ? {
                                sku: log.sku,
                                locationId: log.locationId,
                                previousQuantity: log.previousQuantity,
                                currentQuantity: log.currentQuantity,
                                productTitle: log.productTitle,
                                logId: log.id
                            } : null
                        );
                    });
                    
                    // Update stats
                    const successfulCount = result.logs.filter(log => log.success).length;
                    const totalCount = result.logs.length;
                    totalScans = totalCount;
                    successfulScans = successfulCount;
                    updateStats();
                    
                    addLog(\`📊 Loaded \${result.logs.length} scan logs from database\`, 'info');
                }
            } catch (error) {
                addLog(\`⚠️ Could not load scan logs: \${error.message}\`, 'warning');
            }
        }
    </script>
</body>
</html>
  `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    // Fallback HTML if there's an error fetching locations
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Scanner - Admin</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; }
        .error { background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .back-link { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <h1>📦 Inventory Scanner</h1>
    <div class="error">
        <strong>Error:</strong> Could not load locations. Please try again or contact support.
    </div>
    <a href="/app" class="back-link">← Back to Admin</a>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(fallbackHtml);
  }
} 