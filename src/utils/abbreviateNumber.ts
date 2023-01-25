const abbreviate = (n: number, maxFd = 0, minFd = 0): string => {
  if (n < 1e3) return n.toLocaleString();
  if (n >= 1e3 && n < 1e6)
    return `${Number(n / 1e3).toLocaleString("en", {
      maximumFractionDigits: maxFd,
      minimumFractionDigits: minFd,
    })}K`;
  if (n >= 1e6 && n < 1e9)
    return `${Number(n / 1e6).toLocaleString("en", {
      maximumFractionDigits: maxFd,
      minimumFractionDigits: minFd,
    })}M`;
  if (n >= 1e9)
    return `${Number(n / 1e9).toLocaleString("en", {
      maximumFractionDigits: maxFd,
      minimumFractionDigits: minFd,
    })}B`;

  return NaN.toLocaleString();
};

export default abbreviate;
