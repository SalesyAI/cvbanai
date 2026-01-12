import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Professional resume styles - clean, minimal, ATS-friendly
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 30,
        paddingVertical: 25,
        fontSize: 10,
        lineHeight: 1.4,
        color: '#000000',
        fontFamily: 'Helvetica',
    },
    // Header section
    header: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 12,
        borderBottom: '1.5pt solid #000000',
    },
    photoContainer: {
        width: 65,
        height: 75,
        marginRight: 15,
        border: '0.5pt solid #333333',
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    contactItem: {
        fontSize: 9,
        color: '#333333',
    },
    // Section styles
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: '#f5f5f5',
        paddingVertical: 3,
        paddingHorizontal: 6,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    // Career objective
    objectiveText: {
        fontSize: 9,
        textAlign: 'justify',
        lineHeight: 1.5,
        color: '#222222',
    },
    // Education table
    eduTable: {
        marginBottom: 4,
    },
    eduHeader: {
        flexDirection: 'row',
        backgroundColor: '#eeeeee',
        paddingVertical: 3,
        paddingHorizontal: 4,
        marginBottom: 2,
    },
    eduHeaderText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    eduRow: {
        flexDirection: 'row',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderBottom: '0.5pt solid #eeeeee',
    },
    eduLevel: {
        width: '18%',
        fontSize: 8,
        fontWeight: 'bold',
    },
    eduInst: {
        width: '40%',
        fontSize: 8,
    },
    eduSubject: {
        width: '20%',
        fontSize: 8,
    },
    eduYear: {
        width: '10%',
        fontSize: 8,
        textAlign: 'center',
    },
    eduResult: {
        width: '12%',
        fontSize: 8,
        textAlign: 'right',
    },
    // Experience
    expItem: {
        marginBottom: 6,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
    },
    expDates: {
        fontSize: 8,
        color: '#444444',
    },
    expCompany: {
        fontSize: 9,
        color: '#333333',
        marginTop: 1,
    },
    // Skills section
    skillsContainer: {
        marginBottom: 4,
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillLabel: {
        width: 80,
        fontSize: 9,
        fontWeight: 'bold',
    },
    skillValue: {
        flex: 1,
        fontSize: 9,
    },
    // Two-column layout
    twoColumn: {
        flexDirection: 'row',
        gap: 20,
    },
    column: {
        flex: 1,
    },
    // List items
    listItem: {
        fontSize: 9,
        marginBottom: 2,
        paddingLeft: 8,
    },
    bullet: {
        position: 'absolute',
        left: 0,
    },
    // Reference card
    refCard: {
        marginBottom: 6,
        paddingBottom: 4,
        borderBottom: '0.5pt solid #eeeeee',
    },
    refName: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    refDetail: {
        fontSize: 8,
        color: '#444444',
    },
    // Declaration
    declarationText: {
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'justify',
        color: '#333333',
        lineHeight: 1.4,
    },
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    signatureBlock: {
        fontSize: 9,
    },
});

const EDUCATION_LABELS = {
    ssc: 'S.S.C',
    hsc: 'H.S.C',
    honors: 'Bachelor\'s',
    masters: 'Master\'s',
};

const ResumePDF = ({ data }) => {
    if (!data) return null;

    // Check what sections have content
    const hasEducation = Object.values(data.education || {}).some(e => e.institution);
    const hasExperience = data.experience?.some(e => e.position);
    const hasSkills = data.technicalSkills?.length > 0 || data.tools?.length > 0;
    const hasExtra = data.extraCurricular?.some(e => e.activity);
    const hasLanguages = data.languages?.some(l => l.name);
    const hasReferences = data.references?.some(r => r.fullName);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ===== HEADER ===== */}
                <View style={styles.header}>
                    {data.profilePhoto && (
                        <View style={styles.photoContainer}>
                            <Image style={styles.photo} src={data.profilePhoto} />
                        </View>
                    )}
                    <View style={styles.headerContent}>
                        <Text style={styles.name}>{data.fullName || 'YOUR NAME'}</Text>
                        <View style={styles.contactGrid}>
                            {data.email && <Text style={styles.contactItem}>✉ {data.email}</Text>}
                            {data.phone && <Text style={styles.contactItem}>☎ {data.phone}</Text>}
                            {data.location && <Text style={styles.contactItem}>📍 {data.location}</Text>}
                            {data.linkedinUrl && <Text style={styles.contactItem}>🔗 {data.linkedinUrl}</Text>}
                        </View>
                    </View>
                </View>

                {/* ===== CAREER OBJECTIVE ===== */}
                {data.careerObjective && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Career Objective</Text>
                        <Text style={styles.objectiveText}>{data.careerObjective}</Text>
                    </View>
                )}

                {/* ===== EDUCATION ===== */}
                {hasEducation && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Educational Qualifications</Text>
                        <View style={styles.eduTable}>
                            {/* Table Header */}
                            <View style={styles.eduHeader}>
                                <Text style={[styles.eduHeaderText, { width: '18%' }]}>Level</Text>
                                <Text style={[styles.eduHeaderText, { width: '40%' }]}>Institution</Text>
                                <Text style={[styles.eduHeaderText, { width: '20%' }]}>Subject</Text>
                                <Text style={[styles.eduHeaderText, { width: '10%', textAlign: 'center' }]}>Year</Text>
                                <Text style={[styles.eduHeaderText, { width: '12%', textAlign: 'right' }]}>Result</Text>
                            </View>
                            {/* Table Rows */}
                            {['ssc', 'hsc', 'honors', 'masters'].map(key => {
                                const edu = data.education[key];
                                if (!edu?.institution) return null;
                                return (
                                    <View key={key} style={styles.eduRow}>
                                        <Text style={styles.eduLevel}>{EDUCATION_LABELS[key]}</Text>
                                        <Text style={styles.eduInst}>{edu.institution}</Text>
                                        <Text style={styles.eduSubject}>{edu.subject || '-'}</Text>
                                        <Text style={styles.eduYear}>{edu.passingYear}</Text>
                                        <Text style={styles.eduResult}>{edu.result}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* ===== EXPERIENCE ===== */}
                {hasExperience && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Professional Experience</Text>
                        {data.experience.map((exp, i) => exp.position && (
                            <View key={i} style={styles.expItem}>
                                <View style={styles.expHeader}>
                                    <Text style={styles.expTitle}>{exp.position}</Text>
                                    <Text style={styles.expDates}>{exp.startDate} – {exp.endDate}</Text>
                                </View>
                                <Text style={styles.expCompany}>{exp.company}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== SKILLS & TOOLS ===== */}
                {hasSkills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Skills & Proficiencies</Text>
                        <View style={styles.skillsContainer}>
                            {data.technicalSkills?.length > 0 && (
                                <View style={styles.skillRow}>
                                    <Text style={styles.skillLabel}>Technical:</Text>
                                    <Text style={styles.skillValue}>{data.technicalSkills.join(', ')}</Text>
                                </View>
                            )}
                            {data.tools?.length > 0 && (
                                <View style={styles.skillRow}>
                                    <Text style={styles.skillLabel}>Tools:</Text>
                                    <Text style={styles.skillValue}>{data.tools.join(', ')}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* ===== EXTRA-CURRICULAR ===== */}
                {hasExtra && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Extra-Curricular Activities</Text>
                        {data.extraCurricular.map((item, i) => item.activity && (
                            <Text key={i} style={styles.listItem}>
                                • {item.activity}{item.role ? ` (${item.role})` : ''}{item.duration ? ` – ${item.duration}` : ''}
                                {item.impact ? `: ${item.impact}` : ''}
                            </Text>
                        ))}
                    </View>
                )}

                {/* ===== LANGUAGES & REFERENCES (Two Column) ===== */}
                {(hasLanguages || hasReferences) && (
                    <View style={styles.twoColumn}>
                        {/* Languages */}
                        {hasLanguages && (
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionHeader}>Languages</Text>
                                    {data.languages.map((lang, i) => lang.name && (
                                        <Text key={i} style={styles.listItem}>• {lang.name} – {lang.proficiency}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                        {/* References */}
                        {hasReferences && (
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionHeader}>References</Text>
                                    {data.references.map((ref, i) => ref.fullName && (
                                        <View key={i} style={styles.refCard}>
                                            <Text style={styles.refName}>{ref.fullName}</Text>
                                            {ref.companyPosition && <Text style={styles.refDetail}>{ref.companyPosition}</Text>}
                                            {ref.phone && <Text style={styles.refDetail}>Phone: {ref.phone}</Text>}
                                            {ref.email && <Text style={styles.refDetail}>Email: {ref.email}</Text>}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ===== DECLARATION ===== */}
                {data.declaration && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Declaration</Text>
                        <Text style={styles.declarationText}>{data.declaration}</Text>
                        <View style={styles.signatureRow}>
                            <View>
                                <Text style={styles.signatureBlock}>Date: _______________</Text>
                            </View>
                            <View>
                                <Text style={styles.signatureBlock}>Signature: _______________</Text>
                            </View>
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF;
