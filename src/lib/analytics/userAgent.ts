export type UserAgentInfo = {
  browser: string;
  os: string;
};

export function parseUserAgent(
  userAgent: string | null
): UserAgentInfo {
  if (!userAgent) {
    return {
      browser: "Unknown",
      os: "Unknown",
    };
  }

  let browser = "Unknown";
  let os = "Unknown";

  if (/Edg\//i.test(userAgent)) {
    browser = "Edge";
  } else if (/OPR\//i.test(userAgent)) {
    browser = "Opera";
  } else if (/Chrome\//i.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox\//i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Safari\//i.test(userAgent)) {
    browser = "Safari";
  }

  if (/Windows NT/i.test(userAgent)) {
    os = "Windows";
  } else if (/Android/i.test(userAgent)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = "iOS";
  } else if (/Mac OS X/i.test(userAgent)) {
    os = "macOS";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
  }

  return {
    browser,
    os,
  };
}