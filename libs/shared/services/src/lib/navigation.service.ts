import { Injectable } from '@angular/core';

/**
 * Navigation service that handles external link navigation with security best practices
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  
  /**
   * List of allowed domains for external navigation
   * This helps prevent potential security issues with malicious URLs
   */
  private readonly allowedDomains = [
    'github.com',
    'raw.githubusercontent.com',
    'docs.google.com',
    'stackblitz.com',
    'codesandbox.io'
  ];

  /**
   * Opens an external URL in a new tab with security best practices
   * @param url - The URL to navigate to
   * @param windowName - Optional window name (defaults to '_blank')
   * @returns Promise<boolean> - Returns true if navigation was successful, false otherwise
   */
  openExternalLink(url: string, windowName: string = '_blank'): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Validate the URL
        if (!this.isValidUrl(url)) {
          console.warn('NavigationService: Invalid URL provided:', url);
          resolve(false);
          return;
        }

        // Check if domain is allowed
        if (!this.isDomainAllowed(url)) {
          console.warn('NavigationService: Domain not in allowed list:', url);
          // You might want to show a user confirmation dialog here
        }

        // Open with security features
        const newWindow = window.open(
          url,
          windowName,
          'noopener,noreferrer'
        );

        if (newWindow) {
          // Remove opener reference for security
          newWindow.opener = null;
          resolve(true);
        } else {
          console.warn('NavigationService: Failed to open window. Popup might be blocked.');
          resolve(false);
        }
      } catch (error) {
        console.error('NavigationService: Error opening external link:', error);
        resolve(false);
      }
    });
  }

  openExternalLinkV2(url: string, windowName: string = '_blank'): boolean {
  const newWindow = window.open('', windowName, 'noopener,noreferrer');

  if (!newWindow) {
    console.warn('Popup blocked');
    return false;
  }

  try {
    if (!this.isValidUrl(url)) {
      newWindow.close();
      return false;
    }

    if (!this.isDomainAllowed(url)) {
      const confirmLeave = confirm('This is an external link. Do you want to continue?');
      if (!confirmLeave) {
        newWindow.close();
        return false;
      }
    }

    newWindow.opener = null;
    newWindow.location.href = url;
    return true;
  } catch (err) {
    newWindow.close();
    console.error('Failed to open link:', err);
    return false;
  }
}


  /**
   * Opens a challenge requirement document
   * @param requirementUrl - URL to the requirement document
   * @returns Promise<boolean>
   */
  async openChallengeRequirement(requirementUrl: string): Promise<boolean> {
    if (!requirementUrl) {
      console.warn('NavigationService: No requirement URL provided');
      return false;
    }

    return this.openExternalLink(requirementUrl, 'challenge_requirement');
  }

  /**
   * Validates if a URL is properly formatted
   * @param url - URL to validate
   * @returns boolean
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Checks if the domain is in the allowed list
   * @param url - URL to check
   * @returns boolean
   */
  private isDomainAllowed(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      return this.allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  /**
   * Gets the hostname from a URL for display purposes
   * @param url - URL to extract hostname from
   * @returns string - hostname or empty string if invalid
   */
  getHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }
}
