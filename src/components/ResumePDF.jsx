import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (using standard fonts for now to ensure compatibility)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
        color: '#334155', // Slate-700
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A', // Slate-900
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    contactInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        fontSize: 10,
        color: '#64748B', // Slate-500
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#134E4A', // Teal-900 (Primary)
        borderBottom: '1px solid #CBD5E1',
        paddingBottom: 4,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    jobContainer: {
        marginBottom: 10,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    position: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E293B', // Slate-800
    },
    company: {
        fontSize: 11,
        color: '#0D9488', // Teal-600
        fontWeight: 'bold',
    },
    date: {
        fontSize: 10,
        color: '#64748B',
        fontStyle: 'italic',
    },
    description: {
        fontSize: 10,
        textAlign: 'justify',
    },
    skillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillItem: {
        backgroundColor: '#F0FDFA', // Teal-50
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
        fontSize: 9,
        color: '#0F766E', // Teal-700
    },
});

const ResumePDF = ({ data }) => {
    if (!data) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.fullName || 'Your Name'}</Text>
                    <View style={styles.contactInfo}>
                        {data.email && <Text>{data.email}</Text>}
                        {data.phone && <Text>• {data.phone}</Text>}
                        {data.location && <Text>• {data.location}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.description}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.workHistory && data.workHistory.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {data.workHistory.map((job, index) => (
                            <View key={index} style={styles.jobContainer}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.position}>{job.position}</Text>
                                    <Text style={styles.date}>{job.startDate} - {job.endDate}</Text>
                                </View>
                                <Text style={styles.company}>{job.company}</Text>
                                <Text style={styles.description}>{job.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu, index) => (
                            <View key={index} style={styles.jobContainer}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.position}>{edu.institution}</Text>
                                    <Text style={styles.date}>{edu.graduationYear}</Text>
                                </View>
                                <Text style={styles.company}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillContainer}>
                            {data.skills.map((skill, index) => (
                                <Text key={index} style={styles.skillItem}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF;
