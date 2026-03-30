import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 42,
    height: 42,
    marginRight: 10,
  },

  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  brandSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  heroCard: {
    backgroundColor: '#0F9D6E',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 10,
  },

  heroDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },

  heroButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },

  primaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },

  primaryButtonText: {
    color: '#047857',
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },

  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 6,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  statCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  greenCard: {
    backgroundColor: '#10B981',
  },

  blueCard: {
    backgroundColor: '#2563EB',
  },

  purpleCard: {
    backgroundColor: '#9333EA',
  },

  lightGreenCard: {
    backgroundColor: '#22C55E',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 14,
  },

  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },

  cardBanner: {
    height: 140,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardBody: {
    padding: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },

  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  cardMeta: {
    marginLeft: 6,
    color: '#64748B',
    fontSize: 13,
  },

  cardDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#475569',
  },

  outlineButton: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  outlineButtonText: {
    color: '#059669',
    fontWeight: '700',
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  eventDateBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  eventDate: {
    color: '#9333EA',
    fontWeight: '800',
    fontSize: 15,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  eventLocation: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  footerBox: {
    backgroundColor: '#0F9D6E',
    borderRadius: 22,
    padding: 20,
    marginTop: 10,
  },

  footerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },

  footerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 21,
  },
});