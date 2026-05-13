import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { COLORS } from '../../constants';

/**
 * @param {Array} docs - Array of document objects { title, status, type, url }
 * @param {Boolean} isInternational - Only show if it's an export order
 */
export default function DocumentSection({ docs, isInternational }) {
  if (!isInternational) return null;

  // Default docs if none provided for preview purposes
  const documentList = docs || [
    { id: '1', title: 'Phytosanitary Certificate', status: 'Verified', type: 'CERT', fileType: 'PDF' },
    { id: '2', title: 'Bill of Lading', status: 'Processing', type: 'BOL', fileType: 'PDF' },
    { id: '3', title: 'Commercial Invoice', status: 'Verified', type: 'INV', fileType: 'PDF' },
  ];

  const handleDownload = (doc) => {
    if (doc.status === 'Processing') {
      Alert.alert("Pending", "This document is currently being prepared by customs agents.");
    } else {
      Alert.alert(
        "Secure Download",
        `Do you want to download ${doc.title}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Download", onPress: () => console.log(`Downloading ${doc.title}...`) }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Customs & Compliance</Text>
        <View style={styles.secureBadge}>
          <Text style={styles.secureText}>🔒 ENCRYPTED</Text>
        </View>
      </View>

      <View style={styles.docWrapper}>
        {documentList.map((doc, index) => (
          <TouchableOpacity 
            key={doc.id || index} 
            style={[styles.docItem, index === documentList.length - 1 && { borderBottomWidth: 0 }]} 
            onPress={() => handleDownload(doc)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                {doc.type === 'CERT' ? '📜' : doc.type === 'INV' ? '💰' : '🚢'}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.docTitle}>{doc.title}</Text>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, { backgroundColor: doc.status === 'Verified' ? '#10b981' : '#f59e0b' }]} />
                <Text style={styles.statusText}>{doc.status}</Text>
              </View>
            </View>

            <View style={styles.actionBtn}>
               <Text style={styles.actionIcon}>{doc.status === 'Verified' ? '📥' : '⏳'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.footerNote}>
        These documents are automatically shared with destination port authorities.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, marginBottom: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  secureBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  secureText: { fontSize: 9, fontWeight: '800', color: '#64748b' },
  docWrapper: { backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  docItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  iconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 22 },
  textContainer: { flex: 1, marginLeft: 15 },
  docTitle: { fontSize: 15, fontWeight: '700', color: '#334155', marginBottom: 4 },
  statusPill: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 14 },
  footerNote: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12, fontStyle: 'italic' }
});