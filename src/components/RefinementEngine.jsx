import { ArrowLeft, Copy, Download, Sparkles, Crown, CheckCircle } from 'lucide-react'

export default function RefinementEngine({ originalData, refinedData, onCopyText, onDownloadPDF, onBack }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="py-4 px-8 border-b border-dark-700 glass-dark sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Start Over</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        <span className="font-semibold">AI Enhancement Complete</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCopyText}
                            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-white font-medium transition-all"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy Text</span>
                        </button>
                        <button
                            onClick={onDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-medium transition-all glow-violet"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full font-bold flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                PRO
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Split Pane Editor */}
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Original Data - Left Pane */}
                <div className="flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-dark-700">
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <h2 className="text-lg font-semibold text-gray-400">Original Content</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Header Section */}
                            <section className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                                <h3 className="text-xl font-bold text-gray-300">{originalData?.fullName || 'Your Name'}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {originalData?.email} | {originalData?.phone} | {originalData?.location}
                                </p>
                            </section>

                            {/* Summary Section */}
                            <section className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Summary</h4>
                                <p className="text-gray-300 leading-relaxed">{originalData?.summary || 'No summary provided'}</p>
                            </section>

                            {/* Work History */}
                            <section className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Work Experience</h4>
                                <div className="space-y-4">
                                    {originalData?.workHistory?.map((job, index) => (
                                        <div key={index} className="pl-4 border-l-2 border-dark-600">
                                            <div className="font-semibold text-gray-300">{job.position}</div>
                                            <div className="text-sm text-gray-500">{job.company} • {job.startDate} - {job.endDate}</div>
                                            <p className="text-gray-400 mt-2 text-sm">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Education</h4>
                                {originalData?.education?.map((edu, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="font-semibold text-gray-300">{edu.degree} in {edu.field}</div>
                                        <div className="text-sm text-gray-500">{edu.institution} • {edu.graduationYear}</div>
                                    </div>
                                ))}
                            </section>

                            {/* Skills */}
                            <section className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {originalData?.skills?.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Refined Data - Right Pane */}
                <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-primary-500/5 to-transparent">
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <h2 className="text-lg font-semibold text-white">AI-Enhanced Version</h2>
                            <Sparkles className="w-4 h-4 text-primary-400" />
                        </div>

                        <div className="space-y-6">
                            {/* Header Section */}
                            <section className="p-4 gradient-border rounded-xl">
                                <h3 className="text-xl font-bold text-white">{refinedData?.fullName || 'Your Name'}</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {refinedData?.email} | {refinedData?.phone} | {refinedData?.location}
                                </p>
                            </section>

                            {/* Summary Section - Enhanced */}
                            <section className="p-4 gradient-border rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Summary</h4>
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Enhanced
                                    </span>
                                </div>
                                <p className="text-white leading-relaxed">{refinedData?.summary}</p>
                                {refinedData?.summaryImprovements && (
                                    <div className="mt-3 pt-3 border-t border-dark-700">
                                        <p className="text-xs text-gray-500 mb-2">Improvements made:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {refinedData.summaryImprovements.map((improvement, i) => (
                                                <span key={i} className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                                                    {improvement}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Work History - Enhanced */}
                            <section className="p-4 gradient-border rounded-xl">
                                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Work Experience</h4>
                                <div className="space-y-4">
                                    {refinedData?.workHistory?.map((job, index) => (
                                        <div key={index} className="pl-4 border-l-2 border-primary-500">
                                            <div className="font-semibold text-white">{job.position}</div>
                                            <div className="text-sm text-gray-400">{job.company} • {job.startDate} - {job.endDate}</div>
                                            <p className="text-gray-200 mt-2 text-sm diff-added">{job.description}</p>

                                            {/* Show improvements */}
                                            {job.improvements && job.improvements.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    {job.improvements.map((imp, i) => (
                                                        <div key={i} className="text-xs flex items-center gap-2">
                                                            <span className="text-red-400 line-through">{imp.original}</span>
                                                            <span className="text-gray-500">→</span>
                                                            <span className="text-green-400 diff-improved">{imp.improved}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="p-4 gradient-border rounded-xl">
                                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Education</h4>
                                {refinedData?.education?.map((edu, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="font-semibold text-white">{edu.degree} in {edu.field}</div>
                                        <div className="text-sm text-gray-400">{edu.institution} • {edu.graduationYear}</div>
                                    </div>
                                ))}
                            </section>

                            {/* Skills */}
                            <section className="p-4 gradient-border rounded-xl">
                                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {refinedData?.skills?.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom CTA Bar */}
            <div className="sticky bottom-0 p-4 glass-dark border-t border-dark-700 lg:hidden">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCopyText}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-dark-700 rounded-xl text-white font-medium"
                    >
                        <Copy className="w-5 h-5" />
                        Copy Text
                    </button>
                    <button
                        onClick={onDownloadPDF}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-medium glow-violet"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                        <Crown className="w-4 h-4 text-amber-300" />
                    </button>
                </div>
            </div>
        </div>
    )
}
