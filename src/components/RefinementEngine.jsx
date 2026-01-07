import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, Download, Sparkles, Crown, CheckCircle, Check, Loader2 } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumePDF from './ResumePDF'
import PaymentModal from './PaymentModal'

export default function RefinementEngine({ originalData, refinedData, onCopyText, onDownloadPDF, onBack, hasPurchased = false, resumeId, autoDownload, onDownloadStarted }) {
    const [isCopied, setIsCopied] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    useEffect(() => {
        if (autoDownload && hasPurchased) {
            // Find the hidden PDF link and trigger it
            const downloadLink = document.querySelector('.pdf-download-link');
            if (downloadLink) {
                downloadLink.click();
                onDownloadStarted?.();
            }
        }
    }, [autoDownload, hasPurchased])

    const handleCopy = () => {
        onCopyText()
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handlePDFClick = () => {
        if (hasPurchased) {
            // Direct download - user already paid
            onDownloadPDF()
        } else {
            // Show payment modal
            setShowPaymentModal(true)
        }
    }

    return (
        <div className="min-h-screen animated-bg flex flex-col">
            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                productId="pdf"
                resumeId={resumeId}
            />

            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-light-200 dark:border-dark-700">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Start Over</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        <span className="text-sm font-semibold">AI Enhanced</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isCopied
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 text-text-light-primary dark:text-white'
                                }`}
                        >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>

                        {hasPurchased ? (
                            /* Direct download for paid users */
                            <PDFDownloadLink
                                document={<ResumePDF data={refinedData} />}
                                fileName={`${refinedData?.fullName || 'Resume'}_CVBanai.pdf`}
                                className="pdf-download-link flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all"
                            >
                                {({ loading }) => loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</>
                                ) : (
                                    <><Download className="w-4 h-4" /><span className="hidden sm:inline">Download PDF</span><CheckCircle className="w-4 h-4" /></>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            /* Show price for unpaid users */
                            <button
                                onClick={handlePDFClick}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                                <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs rounded font-bold">
                                    ৳200
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Split Pane */}
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Original Data - Left Pane */}
                <div className="flex-1 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-light-200 dark:border-dark-700">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-text-light-secondary/30 dark:bg-gray-600"></div>
                            <h2 className="text-sm font-semibold text-text-light-secondary dark:text-gray-400">Original</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Header */}
                            <section className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                <h3 className="text-lg font-bold text-text-light-primary dark:text-gray-300">{originalData?.fullName || 'Your Name'}</h3>
                                <p className="text-xs text-text-light-secondary dark:text-gray-500 mt-1">
                                    {originalData?.email} | {originalData?.phone} | {originalData?.location}
                                </p>
                            </section>

                            {/* Summary */}
                            <section className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-500 uppercase tracking-wider mb-2">Summary</h4>
                                <p className="text-sm text-text-light-secondary dark:text-gray-400 leading-relaxed">{originalData?.summary || 'No summary provided'}</p>
                            </section>

                            {/* Work History */}
                            <section className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-500 uppercase tracking-wider mb-3">Experience</h4>
                                <div className="space-y-3">
                                    {originalData?.workHistory?.map((job, index) => (
                                        <div key={index} className="pl-3 border-l-2 border-light-200 dark:border-dark-600">
                                            <div className="font-medium text-sm text-text-light-primary dark:text-gray-300">{job.position}</div>
                                            <div className="text-xs text-text-light-secondary dark:text-gray-500">{job.company} • {job.startDate} - {job.endDate}</div>
                                            <p className="text-xs text-text-light-secondary dark:text-gray-400 mt-1">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Skills */}
                            {originalData?.skills?.length > 0 && (
                                <section className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                    <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {originalData?.skills?.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-light-200 dark:bg-dark-700 text-text-light-secondary dark:text-gray-400 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* Refined Data - Right Pane */}
                <div className="flex-1 p-4 lg:p-6 bg-primary-500/5 dark:bg-primary-500/5">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <h2 className="text-sm font-semibold text-primary-600 dark:text-primary-400">AI-Enhanced</h2>
                            <Sparkles className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
                        </div>

                        <div className="space-y-4">
                            {/* Header */}
                            <section className="p-4 glass rounded-xl">
                                <h3 className="text-lg font-bold text-text-light-primary dark:text-white">{refinedData?.fullName || 'Your Name'}</h3>
                                <p className="text-xs text-text-light-secondary dark:text-gray-400 mt-1">
                                    {refinedData?.email} | {refinedData?.phone} | {refinedData?.location}
                                </p>
                            </section>

                            {/* Summary - Enhanced */}
                            <section className="p-4 glass rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-400 uppercase tracking-wider">Summary</h4>
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded">
                                        <CheckCircle className="w-3 h-3" />
                                        Enhanced
                                    </span>
                                </div>
                                <p className="text-sm text-text-light-primary dark:text-white leading-relaxed">{refinedData?.summary}</p>
                                {refinedData?.summaryImprovements && (
                                    <div className="mt-3 pt-2 border-t border-light-200 dark:border-dark-700">
                                        <div className="flex flex-wrap gap-1.5">
                                            {refinedData.summaryImprovements.map((improvement, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs rounded">
                                                    {improvement}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Work History - Enhanced */}
                            <section className="p-4 glass rounded-xl">
                                <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-400 uppercase tracking-wider mb-3">Experience</h4>
                                <div className="space-y-3">
                                    {refinedData?.workHistory?.map((job, index) => (
                                        <div key={index} className="pl-3 border-l-2 border-primary-500 dark:border-primary-400">
                                            <div className="font-medium text-sm text-text-light-primary dark:text-white">{job.position}</div>
                                            <div className="text-xs text-text-light-secondary dark:text-gray-400">{job.company} • {job.startDate} - {job.endDate}</div>
                                            <p className="text-xs text-text-light-primary dark:text-gray-200 mt-1">{job.description}</p>

                                            {job.improvements?.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {job.improvements.map((imp, i) => (
                                                        <div key={i} className="text-xs flex items-center gap-2">
                                                            <span className="text-red-500 line-through">{imp.original}</span>
                                                            <span className="text-text-light-secondary dark:text-gray-500">→</span>
                                                            <span className="text-green-600 dark:text-green-400">{imp.improved}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Skills */}
                            {refinedData?.skills?.length > 0 && (
                                <section className="p-4 glass rounded-xl">
                                    <h4 className="text-xs font-semibold text-text-light-secondary dark:text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {refinedData?.skills?.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded text-xs border border-primary-500/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom CTA */}
            <div className="sticky bottom-0 p-3 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-t border-light-200 dark:border-dark-700 lg:hidden">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${isCopied
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-light-100 dark:bg-dark-700 text-text-light-primary dark:text-white'
                            }`}
                    >
                        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {isCopied ? 'Copied!' : 'Copy Text'}
                    </button>
                    {hasPurchased ? (
                        <PDFDownloadLink
                            document={<ResumePDF data={refinedData} />}
                            fileName={`${refinedData?.fullName || 'Resume'}_CVBanai.pdf`}
                            className="pdf-download-link flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 rounded-xl text-white font-medium"
                        >
                            {({ loading }) => loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</>
                            ) : (
                                <><Download className="w-5 h-5" /> Download PDF</>
                            )}
                        </PDFDownloadLink>
                    ) : (
                        <button
                            onClick={handlePDFClick}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 dark:bg-primary-400 rounded-xl text-white font-medium"
                        >
                            <Download className="w-5 h-5" />
                            PDF
                            <span className="px-1.5 py-0.5 bg-white/20 text-white text-[10px] rounded font-bold uppercase">
                                ৳200
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
