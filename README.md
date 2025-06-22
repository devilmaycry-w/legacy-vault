```markdown
# Legacy Vault

A modern, secure, and user-friendly digital vault for managing your personal knowledge, memories, sensitive notes, and digital legacy.  
**Legacy Vault** keeps your important information safe, accessible, and ready to pass down to future generations.

---

## 🚀 Vision

To empower individuals to own and organize their digital legacy—notes, credentials, documents, memories—and pass them on with confidence.  
Legacy is more than a vault; it's a living testament to your family's journey.

---

## ✨ Features

- **Secure Storage:** Protect sensitive notes, credentials, and personal records.
- **Personalized Vault:** Name your vault, add descriptions, and customize its background.
- **Cloud Sync:** All settings and data are securely stored per user in Firebase Firestore.
- **Offline Support:** Vault settings are cached locally for fast, reliable access even offline.
- **Authentication:** Only you can access your vault—powered by Firebase Authentication.
- **Instant Feedback:** Friendly toast notifications for all actions (saving, errors, success).
- **Beautiful UI:** Responsive and modern, built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend/Database:** Firebase Firestore, Firebase Authentication

---

## 🏁 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/devilmaycry-w/legacy-vault.git
   cd legacy-vault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project.
   - Copy your Firebase config into `src/services/firebase.ts`.

4. **Run the app:**
   ```bash
   npm start
   ```

---

## 🔒 Security & Privacy

- All user data is securely stored per account in Firestore.
- LocalStorage is used only as a fallback for non-sensitive settings.
- Authentication is required for all features.

---

## 🤝 Contributing

Contributions are welcome!  
Open an issue or submit a pull request for features, bug fixes, or ideas.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- Inspired by the need for secure digital inheritance and knowledge management.
- Built with ♥ by [devilmaycry-w](https://github.com/devilmaycry-w)
```
