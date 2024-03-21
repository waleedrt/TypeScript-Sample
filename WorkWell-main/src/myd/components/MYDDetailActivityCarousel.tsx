import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import MYDDetailActivityCard from './MYDDetailActivityCard';
import MasterStyles from '../../styles/MasterStyles';

const { width } = Dimensions.get('window');

export default class MYDDetailActivityCarousel extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    activities: PropTypes.array.isRequired,
    assignments: PropTypes.array.isRequired,
    participantInfo: PropTypes.object.isRequired
  };

  render = () => {
    const { navigation, activities, assignments } = this.props;

    return (
      <Carousel
        containerCustomStyle={MasterStyles.common.horizontalPadding25}
        data={activities}
        sliderWidth={width}
        itemWidth={225}
        itemHeight={125}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='start'
        removeClippedSubviews={false}
        enableMomentum
        renderItem={({ item, index }) => (
          <MYDDetailActivityCard
            index={index}
            activity={item}
            assignment={assignments.find(
              assignment => assignment.activity === item.detail
            )}
            navigation={navigation}
            animationDelay={500}
          />
        )}
      />
    );
  };
}
