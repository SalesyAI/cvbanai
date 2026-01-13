import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Professional resume styles - matching reference design
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 30, // Standard margin
        paddingVertical: 30,
        fontSize: 10, // Base font size
        lineHeight: 1.4,
        color: '#000000',
        fontFamily: 'Times-Roman', // Classic Serif
    },
    // Header
    header: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottom: '1pt solid #000000', // Optional: Main header visual separation
        paddingBottom: 10,
    },
    headerLeft: {
        flex: 1,
    },
    name: {
        fontSize: 24, // Prominent name
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'Times-Bold',
        marginBottom: 5, // Increased from 2 to prevent overlap
        lineHeight: 1.2, // Ensure prompt line height
    },
    contactLine: {
        fontSize: 10,
        color: '#000000',
        marginBottom: 2, // Increased spacing between contact lines
        lineHeight: 1.3,
    },
    photoContainer: {
        width: 80,
        height: 80, // Passport style
        marginLeft: 15,
        border: '0.5pt solid #000000', // Clean border
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    // Section
    section: {
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        color: '#000000',
        textTransform: 'uppercase',
        borderBottom: '0.5pt solid #000000', // Thin black line
        marginBottom: 4,
        paddingBottom: 1,
        marginTop: 2,
    },
    // Summary/Objective
    summaryText: {
        fontSize: 10,
        textAlign: 'justify',
        lineHeight: 1.3,
    },
    // Skills - Stacked layout
    skillCategory: {
        marginBottom: 4,
    },
    skillLabel: {
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        fontSize: 10,
        marginBottom: 1,
    },
    skillValue: {
        fontSize: 10,
        lineHeight: 1.3,
        paddingLeft: 10, // Indent skills under category
    },
    // Experience/Education item
    itemContainer: {
        marginBottom: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Align baseline
        marginBottom: 1,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        color: '#000000',
    },
    itemCompany: { // Context line (Company / University)
        fontSize: 10,
        fontFamily: 'Times-Bold', // Often bold in classic resumes or italic
        color: '#000000',
    },
    itemSubtitle: { // Role / Degree
        fontSize: 10,
        fontFamily: 'Times-Italic', // Italic for roles/degrees
        color: '#000000',
    },
    itemDates: {
        fontSize: 10,
        color: '#000000',
        textAlign: 'right',
        fontFamily: 'Times-Roman', // Plain for dates
    },
    itemLocation: {
        fontSize: 10,
        color: '#000000',
        textAlign: 'right',
        fontFamily: 'Times-Italic',
    },
    // Bullet points
    bulletItem: {
        flexDirection: 'row',
        marginTop: 1,
        paddingLeft: 10,
    },
    bullet: {
        fontSize: 10,
        marginRight: 4,
        lineHeight: 1.3,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.3,
    },
    // Education specifics
    eduItem: {
        marginBottom: 4,
    },
    eduRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // References & Languages
    refItem: {
        marginBottom: 3,
    },
    refName: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
    },
    refDetails: {
        fontSize: 10,
        color: '#000000',
    },
    langRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    langItem: {
        fontSize: 10,
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
    const hasSkills = data.skillCategories?.some(cat => cat.skills?.length > 0);
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
                        <Text style={styles.contactLine}>
                            {data.email}
                            {data.email && data.phone ? ' | ' : ''}
                            {data.phone}
                        </Text>
                        <Text style={styles.contactLine}>
                            {data.location}
                            {data.location && data.linkedinUrl ? ' | ' : ''}
                            {data.linkedinUrl}
                        </Text>
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

                {/* ===== SKILLS (Stacked Layout) ===== */}
                {hasSkills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Technical Skills</Text>
                        {data.skillCategories.map((cat, i) => cat.skills?.length > 0 && (
                            <View key={i} style={styles.skillCategory}>
                                <Text style={styles.skillLabel}>{cat.category}:</Text>
                                <Text style={styles.skillValue}>{cat.skills.join(', ')}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== EXPERIENCE ===== */}
                {hasExperience && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Relevant Experience</Text>
                        {data.experience.map((exp, i) => exp.position && (
                            <View key={i} style={styles.itemContainer}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>• {exp.position}</Text>
                                    <Text style={styles.itemDates}>{exp.startDate} – {exp.endDate}</Text>
                                </View>
                                <Text style={styles.itemCompany}>{exp.company}</Text>
                                {/* Render Description/Bullets */}
                                {exp.description && (
                                    <View style={{ marginTop: 2 }}>
                                        {exp.description.split('\n').map((line, idx) => (
                                            <View key={idx} style={styles.bulletItem}>
                                                <Text style={styles.bullet}>{line.trim().startsWith('•') ? '' : '•'}</Text>
                                                <Text style={styles.bulletText}>
                                                    {line.trim().replace(/^•\s*/, '')}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
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

                            // Format degree display based on type
                            let degreeDisplay = '';
                            let gradeLabel = 'GPA';

                            if (key === 'masters') {
                                degreeDisplay = edu.degree && edu.major
                                    ? `Masters of ${edu.major} (${edu.degree}) in ${edu.major}`
                                    : `Masters Degree${edu.major ? ' in ' + edu.major : ''}`;
                                gradeLabel = 'CGPA';
                            } else if (key === 'honors') {
                                degreeDisplay = edu.degree && edu.major
                                    ? `Bachelor of ${edu.major} (${edu.degree}) in ${edu.major}`
                                    : `Bachelor's Degree${edu.major ? ' in ' + edu.major : ''}`;
                                gradeLabel = 'CGPA';
                            } else if (key === 'hsc') {
                                degreeDisplay = `Higher Secondary Certificate (HSC)${edu.subject ? ', ' + edu.subject : ''}`;
                            } else if (key === 'ssc') {
                                degreeDisplay = `Secondary School Certificate (SSC)${edu.subject ? ', ' + edu.subject : ''}`;
                            }

                            // Format result display
                            const resultDisplay = edu.result
                                ? `${gradeLabel}: ${edu.result}${key === 'masters' || key === 'honors' ? ' out of 4.00' : ' out of 5.00'}`
                                : '';

                            return (
                                <View key={key} style={styles.eduItem}>
                                    {/* Row 1: Degree | CGPA/GPA */}
                                    <View style={styles.eduRow}>
                                        <Text style={styles.itemTitle}>{degreeDisplay}</Text>
                                        <Text style={styles.itemDates}>{resultDisplay}</Text>
                                    </View>
                                    {/* Row 2: Institution | Year */}
                                    <View style={styles.eduRow}>
                                        <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                                        <Text style={styles.itemLocation}>
                                            {edu.passingYear ? `Year: ${edu.passingYear}` : ''}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* ===== PROJECTS (If we had them, standard layout would be similar) ===== */}

                {/* ===== EXTRA-CURRICULAR ===== */}
                {hasExtra && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications & Activities</Text>
                        {data.extraCurricular.map((item, i) => item.activity && (
                            <View key={i} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.activity}</Text>
                                    {item.role ? ` - ${item.role}` : ''}
                                    {item.duration ? `, ${item.duration}` : ''}
                                    {item.impact ? ` (${item.impact})` : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ===== LANGUAGES ===== */}
                {hasLanguages && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Language Proficiency</Text>
                        <View style={styles.langRow}>
                            {data.languages.map((lang, i) => lang.name && (
                                <Text key={i} style={styles.langItem}>
                                    <Text style={{ fontWeight: 'bold' }}>{lang.name}</Text>: {lang.proficiency}
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
                            <View key={i} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    <Text style={{ fontWeight: 'bold' }}>{ref.fullName}</Text>
                                    {ref.companyPosition ? `, ${ref.companyPosition}` : ''}
                                    {(ref.phone || ref.email) ? ` — ${ref.phone || ''} ${ref.email || ''}` : ''}
                                </Text>
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
