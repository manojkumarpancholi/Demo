import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Recording: {
    height: 80,
    width: 80,
  },
  RecordingView: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  recordingButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  modal: {
    flex: 1,
  },
  flatListView: {
    padding: 10,
    marginHorizontal: 5,
    paddingVertical: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#113C6D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#606060',
    textAlign: 'center',
  },
  EmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  recordTime:{
    color: 'gray', fontSize: 28, fontWeight: '600'
  }
});

export default styles;
