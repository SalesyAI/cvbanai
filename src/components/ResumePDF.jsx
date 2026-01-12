import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Professional resume styles - matching reference design
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 25,
        paddingVertical: 20,
        fontSize: 9,
        lineHeight: 1.35,
        color: '#000000',
        fontFamily: 'Helvetica',
    },
    // Header
    header: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0066B2',
        marginBottom: 3,
    },
    contactLine: {
        fontSize: 8,
        color: '#333333',
        marginBottom: 1,
    },
    photoContainer: {
        width: 70,
        height: 85,
        marginLeft: 15,
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    // Section
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottom: '1.5pt solid #B87333',
        paddingBottom: 2,
        marginBottom: 5,
    },
    // Summary/Objective
    summaryText: {
        fontSize: 9,
        textAlign: 'justify',
        lineHeight: 1.4,
    },
    // Skills
    skillRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    skillLabel: {
        fontWeight: 'bold',
        fontSize: 9,
        width: 90,
    },
    skillValue: {
        flex: 1,
        fontSize: 9,
    },
    // Experience/Education item
    itemContainer: {
        marginBottom: 6,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        flex: 1,
    },
    itemLocation: {
        fontSize: 9,
        color: '#333333',
        textAlign: 'right',
    },
    itemSubtitle: {
        fontSize: 9,
        color: '#333333',
        marginTop: 1,
    },
    itemDates: {
        fontSize: 9,
        color: '#333333',
        textAlign: 'right',
    },
    // Bullet points
    bulletItem: {
        flexDirection: 'row',
        marginTop: 2,
        paddingLeft: 8,
    },
    bullet: {
        fontSize: 9,
        marginRight: 5,
    },
    bulletText: {
        flex: 1,
        fontSize: 8,
        lineHeight: 1.3,
    },
    // Education
    eduItem: {
        marginBottom: 4,
    },
    eduDegree: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    eduInstitution: {
        fontSize: 9,
        color: '#333333',
    },
    eduRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // References
    refItem: {
        marginBottom: 5,
    },
    refName: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    refDetails: {
        fontSize: 8,
        color: '#333333',
    },
    // Languages inline
    langRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    langItem: {
        fontSize: 9,
    },
});

const EDUCATION_LABELS = {
    ssc: 'Secondary School Certificate (S.S.C)',
    hsc: 'Higher Secondary Certificate (H.S.C)',
    honors: 'Bachelor\'s Degree',
    masters: 'Master\'s Degree',
};

const ResumePDF = ({ data }) => {
    if (!data) return null;

    // Check sections
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
                    <View style={styles.headerLeft}>
                        <Text style={styles.name}>{data.fullName || 'Your Name'}</Text>
                        {data.email && <Text style={styles.contactLine}>{data.email}</Text>}
                        {data.phone && <Text style={styles.contactLine}>{data.phone}</Text>}
                        {data.location && <Text style={styles.contactLine}>{data.location}</Text>}
                        {data.linkedinUrl && <Text style={styles.contactLine}>{data.linkedinUrl}</Text>}
                    </View>
                    {data.profilePhoto && (
                        <View style={styles.photoContainer}>
                            <Image style={styles.photo} src={data.profilePhoto} />
                        </View>
                    )}
                </View>

                {/* ===== SUMMARY ===== */}
                {data.careerObjective && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.summaryText}>{data.careerObjective}</Text>
                    </View>
                )}

                {/* ===== TECHNICAL SKILLS ===== */}
                {hasSkills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Technical Skills</Text>
                        {data.technicalSkills?.length > 0 && (
                            <View style={styles.skillRow}>
                                <Text style={styles.skillLabel}>Skills:</Text>
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
                )}

                {/* ===== EXPERIENCE ===== */}
                {hasExperience && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {data.experience.map((exp, i) => exp.position && (
                            <View key={i} style={styles.itemContainer}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{exp.position}</Text>
                                    <Text style={styles.itemDates}>{exp.startDate} – {exp.endDate}</Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== EDUCATION ===== */}
                {hasEducation && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {['masters', 'honors', 'hsc', 'ssc'].map(key => {
                            const edu = data.education[key];
                            if (!edu?.institution) return null;

                            // Format degree display
                            let degreeDisplay = '';
                            if (key === 'ssc' || key === 'hsc') {
                                degreeDisplay = edu.subject ? `${EDUCATION_LABELS[key]} in ${edu.subject}` : EDUCATION_LABELS[key];
                            } else {
                                degreeDisplay = edu.degree && edu.major
                                    ? `${edu.degree} in ${edu.major}`
                                    : (edu.degree || edu.major || EDUCATION_LABELS[key]);
                            }

                            return (
                                <View key={key} style={styles.eduItem}>
                                    <View style={styles.eduRow}>
                                        <Text style={styles.eduDegree}>{degreeDisplay}</Text>
                                        <Text style={styles.itemDates}>{edu.passingYear}</Text>
                                    </View>
                                    <View style={styles.eduRow}>
                                        <Text style={styles.eduInstitution}>{edu.institution}</Text>
                                        <Text style={styles.itemLocation}>{edu.result}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* ===== EXTRA-CURRICULAR ===== */}
                {hasExtra && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Extra-Curricular Activities</Text>
                        {data.extraCurricular.map((item, i) => item.activity && (
                            <View key={i} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.activity}</Text>
                                    {item.role && `, ${item.role}`}
                                    {item.duration && ` (${item.duration})`}
                                    {item.impact && ` - ${item.impact}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== LANGUAGES ===== */}
                {hasLanguages && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Languages</Text>
                        <View style={styles.langRow}>
                            {data.languages.map((lang, i) => lang.name && (
                                <Text key={i} style={styles.langItem}>
                                    <Text style={{ fontWeight: 'bold' }}>{lang.name}</Text> ({lang.proficiency})
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* ===== REFERENCES ===== */}
                {hasReferences && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>References</Text>
                        {data.references.map((ref, i) => ref.fullName && (
                            <View key={i} style={styles.refItem}>
                                <Text style={styles.refName}>{ref.fullName}</Text>
                                {ref.companyPosition && <Text style={styles.refDetails}>{ref.companyPosition}</Text>}
                                {(ref.phone || ref.email) && (
                                    <Text style={styles.refDetails}>
                                        {ref.phone}{ref.phone && ref.email && ' | '}{ref.email}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== DECLARATION ===== */}
                {data.declaration && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Declaration</Text>
                        <Text style={styles.summaryText}>{data.declaration}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF;
