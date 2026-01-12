import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 25,
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 9,
        lineHeight: 1.4,
        color: '#000000',
    },
    // Header with photo
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottom: '1pt solid #000000',
        paddingBottom: 10,
    },
    photoContainer: {
        width: 60,
        height: 70,
        marginRight: 12,
    },
    photo: {
        width: 60,
        height: 70,
        objectFit: 'cover',
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontSize: 8,
        color: '#000000',
        marginTop: 2,
    },
    contactItem: {
        marginRight: 10,
    },
    // Sections
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        borderBottom: '0.5pt solid #000000',
        paddingBottom: 2,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    // Career Objective
    objective: {
        fontSize: 8,
        textAlign: 'justify',
        lineHeight: 1.3,
    },
    // Education Table
    eduRow: {
        flexDirection: 'row',
        marginBottom: 3,
        fontSize: 8,
    },
    eduLabel: {
        width: 80,
        fontWeight: 'bold',
    },
    eduInstitution: {
        flex: 1,
    },
    eduYear: {
        width: 45,
        textAlign: 'center',
    },
    eduResult: {
        width: 50,
        textAlign: 'right',
    },
    // Experience
    expItem: {
        marginBottom: 4,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    expTitle: {
        fontWeight: 'bold',
        fontSize: 9,
    },
    expDate: {
        fontSize: 8,
        fontStyle: 'italic',
    },
    expCompany: {
        fontSize: 8,
        marginTop: 1,
    },
    // Skills row
    skillsText: {
        fontSize: 8,
        lineHeight: 1.4,
    },
    // Languages & References
    twoColumn: {
        flexDirection: 'row',
        gap: 15,
    },
    column: {
        flex: 1,
    },
    listItem: {
        fontSize: 8,
        marginBottom: 2,
    },
    // Declaration
    declaration: {
        fontSize: 7,
        fontStyle: 'italic',
        marginTop: 4,
        textAlign: 'justify',
    },
    signature: {
        marginTop: 8,
        fontSize: 8,
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

    const hasEducation = Object.values(data.education || {}).some(e => e.institution);
    const hasExperience = data.experience?.some(e => e.position);
    const hasSkills = data.technicalSkills?.length > 0 || data.tools?.length > 0;
    const hasExtra = data.extraCurricular?.some(e => e.activity);
    const hasLanguages = data.languages?.some(l => l.name);
    const hasReferences = data.references?.some(r => r.fullName);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    {data.profilePhoto && (
                        <View style={styles.photoContainer}>
                            <Image style={styles.photo} src={data.profilePhoto} />
                        </View>
                    )}
                    <View style={styles.headerText}>
                        <Text style={styles.name}>{data.fullName || 'Your Name'}</Text>
                        <View style={styles.contactRow}>
                            {data.email && <Text style={styles.contactItem}>Email: {data.email}</Text>}
                            {data.phone && <Text style={styles.contactItem}>Phone: {data.phone}</Text>}
                            {data.location && <Text style={styles.contactItem}>Address: {data.location}</Text>}
                        </View>
                        {data.linkedinUrl && (
                            <View style={styles.contactRow}>
                                <Text style={styles.contactItem}>LinkedIn: {data.linkedinUrl}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Career Objective */}
                {data.careerObjective && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Career Objective</Text>
                        <Text style={styles.objective}>{data.careerObjective}</Text>
                    </View>
                )}

                {/* Education */}
                {hasEducation && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Educational Background</Text>
                        {['ssc', 'hsc', 'honors', 'masters'].map(key => {
                            const edu = data.education[key];
                            if (!edu?.institution) return null;
                            return (
                                <View key={key} style={styles.eduRow}>
                                    <Text style={styles.eduLabel}>{EDUCATION_LABELS[key]}</Text>
                                    <Text style={styles.eduInstitution}>{edu.institution} {edu.subject ? `(${edu.subject})` : ''}</Text>
                                    <Text style={styles.eduYear}>{edu.passingYear}</Text>
                                    <Text style={styles.eduResult}>{edu.result}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Experience */}
                {hasExperience && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {data.experience.map((exp, i) => exp.position && (
                            <View key={i} style={styles.expItem}>
                                <View style={styles.expHeader}>
                                    <Text style={styles.expTitle}>{exp.position}</Text>
                                    <Text style={styles.expDate}>{exp.startDate} - {exp.endDate}</Text>
                                </View>
                                <Text style={styles.expCompany}>{exp.company}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills & Tools */}
                {hasSkills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills & Tools</Text>
                        {data.technicalSkills?.length > 0 && (
                            <Text style={styles.skillsText}>
                                <Text style={{ fontWeight: 'bold' }}>Technical Skills: </Text>
                                {data.technicalSkills.join(', ')}
                            </Text>
                        )}
                        {data.tools?.length > 0 && (
                            <Text style={styles.skillsText}>
                                <Text style={{ fontWeight: 'bold' }}>Tools: </Text>
                                {data.tools.join(', ')}
                            </Text>
                        )}
                    </View>
                )}

                {/* Extra-Curricular */}
                {hasExtra && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Extra-Curricular Activities</Text>
                        {data.extraCurricular.map((item, i) => item.activity && (
                            <Text key={i} style={styles.listItem}>
                                • {item.activity} {item.role ? `(${item.role})` : ''} {item.duration ? `- ${item.duration}` : ''}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Languages & References in two columns */}
                {(hasLanguages || hasReferences) && (
                    <View style={styles.twoColumn}>
                        {hasLanguages && (
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Languages</Text>
                                    {data.languages.map((lang, i) => lang.name && (
                                        <Text key={i} style={styles.listItem}>• {lang.name} ({lang.proficiency})</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                        {hasReferences && (
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>References</Text>
                                    {data.references.map((ref, i) => ref.fullName && (
                                        <View key={i} style={{ marginBottom: 4 }}>
                                            <Text style={[styles.listItem, { fontWeight: 'bold' }]}>{ref.fullName}</Text>
                                            <Text style={styles.listItem}>{ref.companyPosition}</Text>
                                            {ref.phone && <Text style={styles.listItem}>{ref.phone}</Text>}
                                            {ref.email && <Text style={styles.listItem}>{ref.email}</Text>}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Declaration */}
                {data.declaration && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Declaration</Text>
                        <Text style={styles.declaration}>{data.declaration}</Text>
                        <View style={styles.signature}>
                            <Text>Signature: _________________</Text>
                            <Text>Date: _________________</Text>
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF;
