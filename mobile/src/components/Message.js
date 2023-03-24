import {useState} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/base';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import colors from '../const/colors';

const Message = ({user_id, profile, item}) => {
  const [paused, setPaused] = useState(true);
  const [audio, setAudio] = useState(null);

  const date = item?.sendAt;
  const time = `${date?.getHours() < 10 ? '0' : ''}${date?.getHours()}:${
    date?.getMinutes() < 10 ? '0' : ''
  }${date?.getMinutes()}`;

  const playAudio = path => {
    try {
      if (!audio) {
        const audio = new Sound('file:///' + path, null, error => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          } else {
            audio.play();
          }
        });
        setAudio(audio);
      } else {
        audio.pause();
        setAudio(null);
      }
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: item.sender === user_id ? 'flex-end' : 'flex-start',
        paddingTop: 8,
        paddingHorizontal: 6,
      }}>
      <View style={styles.message}>
        {item.type === 'text' ? (
          <View style={{paddingHorizontal: 8}}>
            <Text
              style={{
                fontSize: 14,
                color: '#000',
                marginBottom: -4,
              }}>
              {item.content}
            </Text>
            <Text style={{fontSize: 12, marginLeft: 32}}>{time}</Text>
          </View>
        ) : (
          <>
            {item.type.includes('video/') ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setPaused(true)}>
                  <Video
                    paused={paused}
                    poster={'file:///' + item.content}
                    posterResizeMode="cover"
                    style={{
                      width: 250,
                      height: 300,
                      borderRadius: 8,
                    }}
                    source={{uri: 'file:///' + item.content}}
                    resizeMode="cover"
                    onEnd={() => setPaused(true)}
                  />
                </TouchableOpacity>
                {paused ? (
                  <TouchableOpacity
                    activeOpacity={0.4}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginLeft: -20,
                      marginTop: -16,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                    }}
                    onPress={() => setPaused(false)}>
                    <Icon
                      type="font-awesome"
                      name="play"
                      size={20}
                      color={'#fff'}
                    />
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <>
                {item.type.includes('audio/') ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.4}
                      onPress={() => playAudio(item.content)}>
                      <Icon
                        type="font-awesome"
                        name={audio ? 'pause' : 'play'}
                        color={'#4D4D4D'}
                        style={{marginRight: 48}}
                      />
                    </TouchableOpacity>
                    <Image
                      style={{
                        borderRadius: 18,
                        width: 35,
                        height: 35,
                      }}
                      source={{uri: profile}}
                    />
                  </View>
                ) : (
                  <Image
                    style={{width: 200, height: 300, borderRadius: 8}}
                    source={{uri: 'file:///' + item.content}}
                  />
                )}
              </>
            )}
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                marginLeft: 'auto',
                position: 'absolute',
                bottom: 6,
                right: 6,
              }}>
              {time}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 2,
    borderRadius: 12,
    backgroundColor: colors.special2,
  },
});
export default Message;
