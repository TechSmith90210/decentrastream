![decentrastream_header](https://github.com/user-attachments/assets/9aa15b2a-f3c4-4ec1-a308-8c6a63b9aafc)  

# 🎥 DecentraStream – Decentralized Video Sharing  

**DecentraStream** is a blockchain-powered video-sharing platform that empowers creators by eliminating centralized control. Upload videos, engage with comments, and earn crypto tips—all while maintaining ownership of your content.  

🔗 **Live Demo**: [DecentraStream](https://decentrastream.vercel.app)  

---

## ⚡ Quick Start  
### 🎬 Frontend  
```bash
# Clone the frontend repo
git clone https://github.com/TechSmith90210/decentrastream && cd decentrastream

# Install dependencies
npm install

# Start frontend
npm run dev
```

### 🔧 Backend  
```bash
# Clone the backend repo
git clone https://github.com/TechSmith90210/decentrabackend && cd decentrabackend

# Install dependencies
npm install

# Start backend
npm start
```

---

## 🚀 Key Features  
- **📡 Decentralized Video Hosting** – Videos stored on **IPFS**, ensuring censorship resistance.  
- **🎞 Adaptive Streaming** – Transcoding with **FFmpeg**, storing multiple video qualities on IPFS.  
- **📝 On-Chain Comments** – Managed via **`DecentraComments.sol`**.  
- **💰 Crypto Tipping** – ETH tipping via **`DecentraTipping.sol`**.  
- **👤 Custom Profiles** – Managed with **`DecentraProfile.sol`**.  
- **🔐 Web3 Authentication** – MetaMask login via **Wagmi v2**.  

---

## 🛠 Tech Stack  
- **Frontend** – Next.js, Tailwind CSS, Wagmi v2, Axios  
- **Backend** – Express.js, Node.js, FFmpeg, Multer (Deployed on **Railway**)  
- **Storage** – IPFS (via **Pinata**)  
- **Blockchain** – Ethereum **Sepolia Testnet** (Solidity Smart Contracts)  

---

## 📂 Smart Contracts  
DecentraStream's smart contracts power the platform:  
- **`DecentraStream.sol`** – Stores video details and functions.  
- **`DecentraProfile.sol`** – Manages user profiles.  
- **`DecentraComments.sol`** – Enables on-chain comments.  
- **`DecentraTipping.sol`** – Facilitates ETH tipping.  

_All contracts are deployed on the Sepolia Testnet._  

---

## 🔌 Backend API  
| Method | Endpoint  | Description  |
|--------|-----------|--------------|
| `POST` | `/upload` | Transcodes video into multiple qualities, uploads them to IPFS, and returns their IPFS CIDs. |

---

## 🤝 Contributing  
We welcome contributions! To contribute:  
1. **Fork** the repo.  
2. Create a new branch (`feature/new-feature`).  
3. **Commit** your changes.  
4. **Open a pull request** and let's improve DecentraStream together!  

---

## 📜 License  
This project is licensed under the **MIT License**.  

---

Now, everything is correctly linked! Let me know if you need further tweaks. 🚀
