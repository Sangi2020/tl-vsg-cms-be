import checkDiskSpace from 'check-disk-space';
import os from 'os';
import { start } from 'repl';


export const storageUsage = async (req, res) => {
    try {
        let diskSpace;
        
        // Detect the operating system
        const platform = os.platform();
    
        // Fetch disk space based on the OS
        if (platform === 'win32') {
          // For Windows, check the C: drive (or specify another drive if needed)
          diskSpace = await checkDiskSpace('C:');
        } else if (platform === 'linux' || platform === 'darwin') {
          // For Linux and macOS, check the root directory
          diskSpace = await checkDiskSpace('/');
        } else {
          throw new Error('Unsupported OS');
        }
    
        const { free, size, used } = diskSpace;
    
        // Send the storage details as a response (in GB)
        res.json({
          freeSpace: (free / (1024 ** 3)).toFixed(2), // Convert from bytes to GB
          usedSpace: (used / (1024 ** 3)).toFixed(2),
          totalSpace: (size / (1024 ** 3)).toFixed(2),
        });
      } catch (error) {
        console.error('Error fetching storage info:', error);
        res.status(500).json({ error: 'Unable to fetch storage information' });
      }
}


