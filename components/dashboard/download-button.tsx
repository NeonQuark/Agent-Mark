import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { useState } from "react"

interface DesignResult {
    homePage?: string;
    productPage?: string;
    cartPage?: string;
}

export function DownloadButton({ result, prompt }: { result: DesignResult, prompt: string }) {
    const [isZipping, setIsZipping] = useState(false)

    const handleDownload = async () => {
        setIsZipping(true)
        try {
            const zip = new JSZip()

            // Create src folder
            const src = zip.folder("src")

            // Add components
            if (result.homePage) src?.file("HomePage.jsx", result.homePage)
            if (result.productPage) src?.file("ProductPage.jsx", result.productPage)
            if (result.cartPage) src?.file("CartPage.jsx", result.cartPage)

            // Add basic App.js
            src?.file("App.js", `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import CartPage from './CartPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}
`)

            // Add index.js
            src?.file("index.js", `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`)

            // Add package.json
            zip.file("package.json", JSON.stringify({
                name: "ai-generated-store",
                version: "1.0.0",
                private: true,
                dependencies: {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "react-router-dom": "^6.22.0",
                    "lucide-react": "^0.330.0"
                },
                scripts: {
                    "start": "react-scripts start",
                    "build": "react-scripts build"
                }
            }, null, 2))

            // Add README
            zip.file("README.md", `# AI Generated Store
Generated from prompt: "${prompt}"

## How to run
1. \`npm install\`
2. \`npm start\`
`)

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, "ai-store-project.zip")
        } catch (error) {
            console.error(error)
            alert("Failed to zip project")
        } finally {
            setIsZipping(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isZipping}
            className="gap-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
        >
            {isZipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export Project
        </Button>
    )
}
