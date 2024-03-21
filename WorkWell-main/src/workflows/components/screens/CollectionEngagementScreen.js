
import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Analytics from 'expo-firebase-analytics';

// Dynamic Templates
import AffirmationScreenV1 from '../ui_templates/dynamic/AffirmationScreenV1';
import AudioScreenV1 from '../ui_templates/dynamic/AudioScreenV1';
import FreeformQuestionsV1 from '../ui_templates/dynamic/FreeformQuestionsV1';
import InstructionalV1 from '../ui_templates/dynamic/InstructionalV1';
import MultipleChoiceV1 from '../ui_templates/dynamic/MultipleChoiceV1';
import Numeric1StepIntervalLowToHighV1 from '../ui_templates/dynamic/Numeric1StepIntervalLowToHighV1';
import SingleChoiceV1 from '../ui_templates/dynamic/SingleChoiceV1';
import VideoScreenV1 from '../ui_templates/dynamic/VideoScreenV1';

// Semi-Static Templates
import StronglyDisagreeToStronglyAgreeV1 from '../ui_templates/static/StronglyDisagreeToStronglyAgreeV1';
import StronglyAgreeToStronglyDisagreeV1 from '../ui_templates/static/StronglyAgreeToStronglyDisagreeV1';

import NeverToVeryOftenV1 from '../ui_templates/static/NeverToVeryOftenV1';
import VeryOftenToNeverV1 from '../ui_templates/static/VeryOftenToNeverV1';

import NoneAtAllToAnExtremeAmountV1 from '../ui_templates/static/NoneAtAllToAnExtremeAmountV1';
import AnExtremeAmountToNoneAtAll from '../ui_templates/static/AnExtremeAmountToNoneAtAllV1';

import OnlyNegativeToOnlyPositiveV1 from '../ui_templates/static/OnlyNegativeToOnlyPositiveV1';

import AlmostEverydayToAlmostNeverV1 from '../ui_templates/static/AlmostEverydayToAlmostNeverV1';

import RarelyOrNeverToMoreThanOnceADayV1 from '../ui_templates/static/RarelyOrNeverToMoreThanOnceADayV1';

import NotAtAllToAGreatDealV1 from '../ui_templates/static/NotAtAllToAGreatDealV1';
import NotAtAllToAGreatDealWithNullV1 from '../ui_templates/static/NotAtAllToAGreatDealWithNullV1';
import AGreatDealToNotAtAllV1 from '../ui_templates/static/AGreatDealToNotAtAllV1';
import AGreatDealToNotAtAllWithNullV1 from '../ui_templates/static/AGreatDealToNotAtAllWithNullV1';

import NotAtAllDifficultToExtremelyDifficult from '../ui_templates/static/NotAtAllDifficultToExtremelyDifficultV1';
import ExtremelyDifficultToNotAtAllDifficultV1 from '../ui_templates/static/ExtremelyDifficultToNotAtAllDifficultV1';

import VeryUnhappyFaceToVeryHappyFaceV1 from '../ui_templates/static/VeryUnhappyFaceToVeryHappyFaceV1';
import YesOrNoV1 from '../ui_templates/static/YesOrNoV1';

import {
  retrieveWorkflowCollectionEngagement,
  updateWorkflowCollectionEngagement,
  createWorkflowCollectionEngagementDetail,
  updateWorkflowCollectionEngagementDetail,
} from '../../redux/actionCreators';
import ExtremelyNegativeToExtremelyPositiveWithNullV1 from '../ui_templates/static/ExtremelyNegativeToExtremelyPositiveWithNullV1';
import BirthdateV1 from '../ui_templates/static/BirthdateV1';
import ErrorMessage from '../../../components/modals/ErrorMessage';

const stepMap = {
  // "Dynamic" Templates
  audio_v1: AudioScreenV1,
  video_v1: VideoScreenV1,
  affirmation_v1: AffirmationScreenV1,
  freeform_questions_v1: FreeformQuestionsV1,
  instructional_v1: InstructionalV1,
  single_choice_v1: SingleChoiceV1,
  multiple_choice_v1: MultipleChoiceV1,
  // "Semi-Static" Templates
  an_extreme_amount_to_none_at_all_v1: AnExtremeAmountToNoneAtAll,
  extremely_negative_to_extremely_positive_with_null_v1: ExtremelyNegativeToExtremelyPositiveWithNullV1,
  strongly_disagree_to_strongly_agree_v1: StronglyDisagreeToStronglyAgreeV1,
  strongly_agree_to_strongly_disagree_v1: StronglyAgreeToStronglyDisagreeV1,
  never_to_very_often_v1: NeverToVeryOftenV1,
  very_often_to_never_v1: VeryOftenToNeverV1,
  none_at_all_to_an_extreme_amount_v1: NoneAtAllToAnExtremeAmountV1,
  only_negative_to_only_positive_v1: OnlyNegativeToOnlyPositiveV1,
  almost_everyday_to_almost_never_v1: AlmostEverydayToAlmostNeverV1,
  rarely_or_never_to_more_than_once_a_day_v1: RarelyOrNeverToMoreThanOnceADayV1,
  not_at_all_to_a_great_deal_v1: NotAtAllToAGreatDealV1,
  not_at_all_to_a_great_deal_with_null_v1: NotAtAllToAGreatDealWithNullV1,
  a_great_deal_to_not_at_all_v1: AGreatDealToNotAtAllV1,
  a_great_deal_to_not_at_all_with_null_v1: AGreatDealToNotAtAllWithNullV1,
  not_at_all_difficult_to_extremely_difficult_v1: NotAtAllDifficultToExtremelyDifficult,
  extremely_difficult_to_not_at_all_difficult_v1: ExtremelyDifficultToNotAtAllDifficultV1,
  very_unhappy_face_to_very_happy_face_v1: VeryUnhappyFaceToVeryHappyFaceV1,
  numeric_1_step_interval_low_to_high_v1: Numeric1StepIntervalLowToHighV1,
  yes_or_no_v1: YesOrNoV1,
  birthdate_v1: BirthdateV1,
};

function mapStateToProps(state, ownProps) {

  const collection = state.workflowHistory.collections.find(collection => collection.self_detail === state.workflows.currentCollectionURL);
  const workflows = collection.workflowcollectionmember_set.map(collectionMember => collectionMember.workflow);

  return {
    collection,
    workflows,
    collectionEngagement: state.workflows.collectionEngagement,
    collectionEngagementDetail: state.workflows.collectionEngagementDetail,
    isPending: state.workflows.isPending,
    pendingActions: state.workflows.pendingActions,

    // These two props assist with navigation within an engagement
    // and inform the app where the engagement started from.
    engagementStartedFrom: ownProps.route.params?.engagementStartedFrom,

    previousRouteKey: ownProps.route.params?.previousRouteKey,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      dispatchRetrieveWorkflowCollectionEngagement: retrieveWorkflowCollectionEngagement,
      dispatchUpdateWorkflowCollectionEngagement: updateWorkflowCollectionEngagement,
      dispatchCreateWorkflowCollectionEngagementDetail: createWorkflowCollectionEngagementDetail,
      dispatchUpdateWorkflowCollectionEngagementDetail: updateWorkflowCollectionEngagementDetail,
    },
    dispatch
  );
}

/**
 * CollectionEngagementScreen
 *
 * This component is used while the user is engaging
 * with a given WorkflowCollection.
 *
 * It does not have any UI of it's own, but rather using used to load (via nesting)
 * various "UI Templates" that have been created for the
 * steps of individual workflows within the collection.
 */
class CollectionEngagementScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatchCreateWorkflowCollectionEngagementDetail: PropTypes.func.isRequired,
    dispatchUpdateWorkflowCollectionEngagement: PropTypes.func.isRequired,
    dispatchRetrieveWorkflowCollectionEngagement: PropTypes.func.isRequired,
    previousScreen: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { route, workflows } = props;
    const currentWorkflowID = route.params.workflowID;

    // Get the workflowStepID from the last navigation call
    // or if not available determine the first step of the workflow.
    const currentStepID = route.params.hasOwnProperty('workflowStepID')
      ? route.params.workflowStepID
      : workflows.find((workflow) => workflow.id === currentWorkflowID)
        .workflowstep_set.sort((step1, step2) => step1.order - step2.order)[0]
        .id;

    const currentWorkflow = workflows.find(
      (workflow) => workflow.id === currentWorkflowID
    );

    const currentStep = currentWorkflow.workflowstep_set.find(
      (step) => step.id === currentStepID
    );

    const currentStepType = currentStep.ui_template;

    this.state = {
      componentHasFocus: false,
      startTime: moment().toISOString(),
      currentUserResponse: {},
      currentWorkflowID,
      currentStepID,
      currentWorkflow,
      currentStep,
      currentStepType,
      apiError: null,
    };
  }

  removeBlurSubscription = this.props.navigation.addListener('blur', () => {
    this.setState({ componentHasFocus: false });
  });

  removeFocusSubscription = this.props.navigation.addListener('focus', () => {
    const {
      dispatchRetrieveWorkflowCollectionEngagement,
      collectionEngagement,
    } = this.props;
    // Get the latest Collection Engagement data from the API
    // so that we know whether to POST/PATCH engagement detail record for current step.
    dispatchRetrieveWorkflowCollectionEngagement(collectionEngagement);
    this.setState({
      componentHasFocus: true,
    });
  });

  componentWillUnmount() {
    this.removeBlurSubscription();
    this.removeFocusSubscription();
  }

  syncUserInput = (dataFromCurrentScreen) => {
    // console.log('USER_DATA: ', dataFromCurrentScreen);
    this.setState({
      currentUserResponse: dataFromCurrentScreen,
    });
  };

  /**
   * Simple recursive function which waits until
   * there is not a pending API response before
   * invoking the `callback` parameter.
   */
  waitForAPIResponse = (callback) => {
    const { pendingActions } = this.props;

    if (pendingActions.length > 0) {
      setTimeout(this.waitForAPIResponse, 50, callback);
    } else {
      callback();
    }
  };

  /**
   * Create a new CollectionEngagementDetail record via the API
   * and wait for the response.
   */
  next = () => {
    const {
      collectionEngagement,
      dispatchCreateWorkflowCollectionEngagementDetail,
      dispatchUpdateWorkflowCollectionEngagementDetail,
    } = this.props;
    const { currentStepID, currentUserResponse, startTime } = this.state;

    const endTime = moment().toISOString();

    // STEP 1: Determine if there is an existing CollectionEngagementDetail
    const existingEngagementDetail = collectionEngagement.hasOwnProperty(
      'workflowcollectionengagementdetail_set'
    )
      ? collectionEngagement.workflowcollectionengagementdetail_set.find(
        (existingDetail) => existingDetail.step === currentStepID
      )
      : null;

    existingEngagementDetail
      ? dispatchUpdateWorkflowCollectionEngagementDetail(
        existingEngagementDetail,
        currentUserResponse,
        startTime,
        endTime
      )
      : dispatchCreateWorkflowCollectionEngagementDetail(
        collectionEngagement,
        currentStepID,
        currentUserResponse,
        startTime,
        endTime
      );

    setTimeout(this.waitForAPIResponse, 50, this.nextAfterAPIResponse);
  };

  /**
   * Invoked by `next()` after API response is received.
   * Navigates to the next step as indicated by the API
   * or back to the home screen if there is no next step.
   */
  nextAfterAPIResponse = () => {
    const {
      navigation,
      route,
      collection,
      collectionEngagement,
      collectionEngagementDetail,
      dispatchUpdateWorkflowCollectionEngagement,
      engagementStartedFrom,
    } = this.props;

    const { currentWorkflowID, apiError } = this.state;

    // Don't proceed if an apiError was encountered.
    if (apiError) return;

    /**
     * There are a couple of conditions in which the user's engagement
     * can be considered complete:
     * 1. They have completed the last step of the workflow collection.
     * 2. They have completed the last step of the current workflow in an activity collection.
     */
    const engagementComplete =
      (!collectionEngagementDetail.state.next_step_id &&
        !collectionEngagementDetail.state.next_workflow) ||
      (collection.category === 'ACTIVITY' &&
        currentWorkflowID !==
        collectionEngagementDetail.state.next_workflow.split('/')[6]);

    /**
     * Either return the user to the top of the current stack navigator
     * or present the appropriate next step of the engagement.
     */
    if (engagementComplete) {
      const endTime = moment().toISOString();
      dispatchUpdateWorkflowCollectionEngagement(
        {
          engagementURL: collectionEngagement.self_detail,
          endDateTime: endTime
        });

      setTimeout(this.waitForAPIResponse, 50, () =>
        collection.category === 'ACTIVITY' ? this.exit() : navigation.popToTop()
      );

      // Send Event Info to Firebase
      Analytics.logEvent(collection.category === 'ACTIVITY'
        ? 'activity_collection_completed' : 'survey_collection_completed',
      )


    } else {
      navigation.push('CollectionEngagement', {
        workflowID: collectionEngagementDetail.state.next_workflow.split(
          '/'
        )[6],
        workflowStepID: collectionEngagementDetail.state.next_step_id,
        engagementStartedFrom,
        previousRouteKey: route.key,
      });
    }
  };

  /**
   * If possible, move back to the previous step in the Workflow
   * or return the CollectionDetailScreen
   */
  back = () => {
    const {
      collectionEngagement,
      dispatchCreateWorkflowCollectionEngagementDetail,
      dispatchUpdateWorkflowCollectionEngagementDetail,
    } = this.props;

    const { currentStepID, currentUserResponse, startTime } = this.state;

    // STEP 1: Determine if there is an existing CollectionEngagementDetail
    existingEngagementDetail = collectionEngagement.workflowcollectionengagementdetail_set.find(
      (existingDetail) => existingDetail.step === currentStepID
    );

    // STEP 2: Create or updated CollectionEngagementDetail
    existingEngagementDetail
      ? dispatchUpdateWorkflowCollectionEngagementDetail(
        existingEngagementDetail,
        currentUserResponse,
        startTime,
        null
      )
      : dispatchCreateWorkflowCollectionEngagementDetail(
        collectionEngagement,
        currentStepID,
        currentUserResponse,
        startTime,
        null
      );

    setTimeout(this.waitForAPIResponse, 50, this.backAfterAPIResponse);
  };

  /**
   * Invoked by `back()` after API response is received.
   * Navigates to the previous step as indicated by the API
   * or back to the collection detail screen if there is no previous step.
   */
  backAfterAPIResponse = () => {
    const {
      navigation,
      collectionEngagementDetail,
      engagementStartedFrom,
      previousRouteKey,
    } = this.props;

    previousRouteKey
      ? navigation.navigate({
        routeName: 'CollectionEngagement',
        key: previousRouteKey,
      })
      : collectionEngagementDetail.state.prev_step_id
        ? navigation.push('CollectionEngagement', {
          workflowID: collectionEngagementDetail.state.prev_workflow.split(
            '/'
          )[6],
          workflowStepID: collectionEngagementDetail.state.prev_step_id,
          engagementStartedFrom,
        })
        : this.exit();
  };

  exit = () => {
    const { navigation, engagementStartedFrom } = this.props;
    engagementStartedFrom
      ? navigation.navigate(engagementStartedFrom)
      : navigation.navigate('CollectionDetail');
  };

  render() {
    const { navigation } = this.props;
    const {
      currentWorkflow,
      currentStep,
      currentStepType,
      componentHasFocus,
    } = this.state;

    // componentHasFocus && console.log(currentStepType);

    const CurrentScreen = stepMap[currentStepType];

    return (
      <>
        <ErrorMessage
          onError={() => this.setState({ apiError: true })}
          onErrorClear={() => this.setState({ apiError: false })}
        />
        <CurrentScreen
          workflow={currentWorkflow}
          step={currentStep}
          isFocused={componentHasFocus}
          cancelAction={this.exit}
          nextAction={this.next}
          backAction={this.back}
          syncInput={this.syncUserInput}
          index={currentStep.id}
          navigation={navigation}
        />
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionEngagementScreen);
