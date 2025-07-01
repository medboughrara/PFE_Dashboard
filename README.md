# KUKA HMI Dashboard

A modern web-based Human Machine Interface (HMI) dashboard built with Next.js, TypeScript, and Tailwind CSS for KUKA robotics systems.

## Live Demo

Visit the live demo at: still working on

## Detailed Installation Guide

### System Requirements

1. **Node.js Installation**
   - Download and install Node.js v18 or higher from [Node.js official website](https://nodejs.org/)
   - Verify installation:
     ```powershell
     node --version
     ```

2. **PNPM Installation**
   - Install pnpm globally using PowerShell:
     ```powershell
     iwr https://get.pnpm.io/install.ps1 -useb | iex
     ```
   - Verify installation:
     ```powershell
     pnpm --version
     ```

3. **Git Installation**
   - Download and install Git from [Git official website](https://git-scm.com/)
   - Verify installation:
     ```powershell
     git --version
     ```

### Project Setup

1. **Clone the Repository**
   ```powershell
   git clone https://github.com/medboughrara/KUKA-HMI-Dashboard.git
   cd KUKA-HMI-Dashboard
   ```

2. **Install Dependencies**
   ```powershell
   pnpm install
   ```

3. **Development Server**
   - Start the development server:
     ```powershell
     pnpm dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser

4. **Production Build**
   ```powershell
   pnpm build
   pnpm start
   ```

### Environment Setup (Optional)

Create a `.env.local` file in the root directory if you need to customize any environment variables:
```env
NEXT_PUBLIC_BASE_PATH=/KUKA-HMI-Dashboard
```

## Features Guide

### 1. Camera Monitoring
- Access via: `/camera` route
- Features:
  - Real-time camera feed monitoring
  - Multiple camera view support
  - Camera control interface

### 2. Conveyor Control
- Access via: `/conveyors` route
- Features:
  - Live conveyor status monitoring
  - Speed control interface
  - Emergency stop functionality

### 3. Statistics Dashboard
- Access via: `/statistics` route
- Features:
  - Real-time performance metrics
  - Historical data visualization
  - Custom reporting tools

### 4. Process Flow
- Access via: `/process-flow` route
- Features:
  - Visual process flow diagrams
  - Real-time status updates
  - Process control interface

## Project Structure Explained

```plaintext
├── app/                    # Next.js 13+ app directory
│   ├── camera/            # Camera monitoring feature
│   ├── conveyors/         # Conveyor control system
│   ├── statistics/        # Statistics and analytics
│   └── process-flow/      # Process flow visualization
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx # Theme configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## Development Guide

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- shadcn/ui for consistent UI components

### Adding New Features

1. Create new components in `components/`
2. Add new pages in `app/`
3. Update types as needed
4. Test thoroughly before committing

## Troubleshooting

### Common Issues

1. **Port 3000 Already in Use**
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Dependencies Issues**
   ```powershell
   rm -r -force node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

3. **Build Errors**
   - Clear Next.js cache:
     ```powershell
     rm -r -force .next
     pnpm build
     ```

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```powershell
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```powershell
   git commit -m "Add: your feature description"
   ```
4. Push to the branch:
   ```powershell
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.

=======
# KUKA HMI Cube Sorting System

A modern Human-Machine Interface (HMI) for a KUKA-based cube sorting system, featuring real-time camera vision, conveyor management, statistics, error handling, and user roles.  
Built with Next.js (React), FastAPI, OpenCV, and Tailwind CSS.

---

## Features

- **Live Camera Vision:**  
  Real-time detection and visualization of red, green, and blue cubes using OpenCV color segmentation.

- **Conveyor Management:**  
  Start/stop conveyors, monitor status, clear jams, and adjust speed.

- **Process Flow Visualization:**  
  Animated flow of cubes through the system, including robot pickup and sorting.

- **Statistics & History:**  
  Live and historical data, charts, and export options (CSV/JSON).

- **Error & Alert Management:**  
  Real-time error log, critical alerts, and maintenance actions.

- **User Management & Roles:**  
  Demo login for Operator, Maintenance, and Admin roles with permissions.

---

## Project Structure

```
d:\kuka-hmi(2)\
│
├── app\                # Next.js frontend (pages, components, styles)
├── backend\            # FastAPI backend (main.py)
├── public\             # Static assets
├── README.md           # This file
└── ...
```

---

## Getting Started

### 1. Backend (FastAPI + OpenCV)

- **Install dependencies:**
  ```bash
  pip install fastapi uvicorn opencv-python numpy
  ```

- **Run the backend:**
  ```bash
  cd backend
  uvicorn main:app --host 127.0.0.1 --port 8500
  ```

- **Camera stream:**  
  Make sure your IP camera or phone stream is available at `http://192.168.100.84:8080/video` (or update in `main.py`).

### 2. Frontend (Next.js)

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Run the frontend:**
  ```bash
  npm run dev
  ```

- **Access the app:**  
  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

- **Operator:** `operator1 / demo123`
- **Maintenance:** `maintenance1 / demo123`
- **Admin:** `admin1 / demo123`

---

## Customization

## Adding a Video to the Dashboard

To display a video on your dashboard, add your video file to the `public` directory. For example, place your video at `public/0630 (1).mp4`.

You can embed the video in your dashboard or any page using the following HTML snippet:

```jsx
<video width="640" height="360" controls>
  <source src="/0630 (1).mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

Add this code to the appropriate React component (e.g., `app/page.tsx`) to display the video player on your dashboard.

---

## Notes

- The backend `/api/detections` endpoint returns only the latest frame's detections.
- The frontend only displays current detections; stale bounding boxes are automatically cleared.
- For best results, use a well-lit environment and calibrate color ranges as needed.

---

## License

MIT License

---
