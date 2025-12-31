import { useState, useRef } from 'react'
import { FileText, Upload, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default function InputHub({ onStartFromScratch, onUploadFile }) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && isValidFileType(file)) {
            processFile(file)
        }
    }

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        if (file && isValidFileType(file)) {
            processFile(file)
        }
    }

    const isValidFileType = (file) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.docx')
    }

    const processFile = (file) => {
        setUploadedFile(file)
        setIsProcessing(true)

        // Simulate processing delay
        setTimeout(() => {
            setIsProcessing(false)
            onUploadFile(file)
        }, 2000)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="py-6 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">CVBanai</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Features</a>
                        <a href="#" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="hover:text-white transition-colors">Templates</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-gray-300">AI-Powered Resume Enhancement</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up">
                        Build Resumes That
                        <span className="block gradient-text">Get You Hired</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Transform your career story into a powerful, ATS-optimized resume with our AI refinement engine. Stand out from the crowd.
                    </p>

                    {/* Action Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Start from Scratch Card */}
                        <button
                            onClick={onStartFromScratch}
                            className="group glass rounded-2xl p-8 text-left hover:glow-violet transition-all duration-500 animate-slide-up"
                            style={{ animationDelay: '0.3s' }}
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                Start from Scratch
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-gray-400">
                                Build your resume step-by-step with our guided form. Perfect for creating a fresh, professional resume.
                            </p>
                            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    Guided process
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    5 min setup
                                </span>
                            </div>
                        </button>

                        {/* Upload Existing Card */}
                        <div
                            className={`group glass rounded-2xl p-8 text-left transition-all duration-500 animate-slide-up cursor-pointer ${isDragging ? 'ring-2 ring-accent-500 glow-cyan' : 'hover:glow-cyan'
                                }`}
                            style={{ animationDelay: '0.4s' }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileInput}
                                className="hidden"
                            />

                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="w-7 h-7 text-white" />
                            </div>

                            {isProcessing ? (
                                <>
                                    <h3 className="text-xl font-bold mb-2">Processing...</h3>
                                    <p className="text-gray-400">Parsing {uploadedFile?.name}</p>
                                    <div className="mt-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        Upload Existing
                                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-gray-400">
                                        {isDragging
                                            ? 'Drop your file here...'
                                            : 'Drag & drop your resume or click to browse. We\'ll extract and enhance it.'}
                                    </p>
                                    <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            PDF / DOCX
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            Auto-parse
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <p className="text-sm text-gray-500 mb-4">Trusted by professionals worldwide</p>
                        <div className="flex items-center justify-center gap-8 opacity-40">
                            <span className="text-xl font-bold">Google</span>
                            <span className="text-xl font-bold">Microsoft</span>
                            <span className="text-xl font-bold">Amazon</span>
                            <span className="text-xl font-bold">Meta</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
