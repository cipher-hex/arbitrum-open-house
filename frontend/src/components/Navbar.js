import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar({ account, connectWallet, setPage, isOwner, coinBalance }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when a navigation option is clicked
  const handleNavClick = (page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-logo" onClick={() => handleNavClick("home")}>
        <span className="logo-text">NoRiskPot</span>
        <span className="logo-subtitle">Zero Loss Lottery</span>
      </div>

      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <button className="nav-link" onClick={() => handleNavClick("home")}>
          Home
        </button>
        <button className="nav-link" onClick={() => handleNavClick("buy")}>
          Buy Tickets
        </button>
        <button className="nav-link" onClick={() => handleNavClick("claim")}>
          Claim Funds
        </button>
        {isOwner && (
          <button
            className="nav-link admin"
            onClick={() => handleNavClick("admin")}
          >
            Admin Panel
          </button>
        )}
      </div>

      <div className="navbar-wallet">
        {account ? (
          <div className="wallet-info">
            <div className="wallet-balance">
              {parseFloat(coinBalance).toFixed(2)} COIN
            </div>
            <div
              className="wallet-address copyable"
              onClick={copyAddress}
              title="Copy address"
            >
              {copied ? "Copied!" : `${account.slice(0, 6)}...${account.slice(-4)}`}
            </div>
          </div>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
