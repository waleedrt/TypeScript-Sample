import React, { useState, useEffect, useReducer } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

// Definitions
import { WorkflowCollectionType } from '../../workflows/types';
import { RootReduxType } from '../../../config/configureStore';
import MasterStyles from '../../styles/MasterStyles';

// Components
import StylizedButton from '../StylizedButton';
import SolidTopModalWithCustomHeaderText from './SolidTopModalWithCustomHeaderText';

// Hooks
import useSubscribedCollections from '../../workflows/hooks/useSubscribedCollections';
import useRecommendedCollections from '../../workflows/hooks/useRecommendedCollections';

// Redux
import {
  createWorkflowCollectionRecommendation,
  createWorkflowCollectionSubscription,
  updateWorkflowCollectionRecommendation,
  updateWorkflowCollectionSubscription,
} from '../../workflows/redux/actionCreators';

type reducerState = {
  collectionsWithOutdatedRecommendations: WorkflowCollectionType[];
  collectionsWithInvalidRecommendations: WorkflowCollectionType[];
  collectionsWithOutdatedSubscriptions: WorkflowCollectionType[];
  collectionsWithInvalidSubscriptions: WorkflowCollectionType[];
};

type reducerAction =
  | { type: 'addOutdatedRecommendation'; collection: WorkflowCollectionType }
  | { type: 'removeOutdatedRecommendation'; collection: WorkflowCollectionType }
  | { type: 'addInvalidRecommendation'; collection: WorkflowCollectionType }
  | { type: 'removeInvalidRecommendation'; collection: WorkflowCollectionType }
  | { type: 'addOutdatedSubscription'; collection: WorkflowCollectionType }
  | { type: 'removeOutdatedSubscription'; collection: WorkflowCollectionType }
  | { type: 'addInvalidSubscription'; collection: WorkflowCollectionType }
  | { type: 'removeInvalidSubscription'; collection: WorkflowCollectionType };

function reducer(state: reducerState, action: reducerAction): reducerState {
  console.log('Processing Action', action.type);

  switch (action.type) {
    case 'addInvalidRecommendation':
      return {
        ...state,
        collectionsWithInvalidRecommendations: [
          ...state.collectionsWithInvalidRecommendations.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
          action.collection,
        ],
      };
    case 'removeInvalidRecommendation':
      return {
        ...state,
        collectionsWithInvalidRecommendations: [
          ...state.collectionsWithInvalidRecommendations.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
        ],
      };
    case 'addOutdatedRecommendation':
      return {
        ...state,
        collectionsWithOutdatedRecommendations: [
          ...state.collectionsWithOutdatedRecommendations.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
          action.collection,
        ],
      };
    case 'removeOutdatedRecommendation':
      return {
        ...state,
        collectionsWithOutdatedRecommendations: [
          ...state.collectionsWithOutdatedRecommendations.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
        ],
      };
    case 'addInvalidSubscription':
      return {
        ...state,
        collectionsWithInvalidSubscriptions: [
          ...state.collectionsWithInvalidSubscriptions.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
          action.collection,
        ],
      };
    case 'removeInvalidSubscription':
      return {
        ...state,
        collectionsWithInvalidSubscriptions: [
          ...state.collectionsWithInvalidSubscriptions.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
        ],
      };
    case 'addOutdatedSubscription':
      return {
        ...state,
        collectionsWithOutdatedSubscriptions: [
          ...state.collectionsWithOutdatedSubscriptions.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
          action.collection,
        ],
      };
    case 'removeOutdatedSubscription':
      return {
        ...state,
        collectionsWithOutdatedSubscriptions: [
          ...state.collectionsWithOutdatedSubscriptions.filter(
            (collection) => collection.detail !== action.collection.detail
          ),
        ],
      };

    default:
      return state;
  }
}

/**
 * A Modal that will appear when a user has subscriptions
 * or recommendations to collections that have been marked
 * inactive.
 */
export default function InactiveCollections({
  onOpen,
  onClose,
}: {
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionsProcessed, setCollectionsProcessed] = useState(false);

  const [state, localDispatch] = useReducer(reducer, {
    collectionsWithOutdatedRecommendations: [],
    collectionsWithInvalidRecommendations: [],
    collectionsWithOutdatedSubscriptions: [],
    collectionsWithInvalidSubscriptions: [],
  });

  const subscribedCollections = useSubscribedCollections(true);
  const recommendedCollections = useRecommendedCollections(false);

  /**
   * Determine what subscriptions and recommendations need to
   * be upgraded or removed.
   */
  useEffect(() => {
    // If the user does not have an subscriptions or recommendations
    // then there is nothing to do.
    if (!subscribedCollections || !recommendedCollections) return;

    subscribedCollections?.forEach((collection) => {
      if (!collection.active) {
        if (collection.newer_version) {
          localDispatch({ type: 'addOutdatedSubscription', collection });
        } else {
          localDispatch({ type: 'addInvalidSubscription', collection });
        }
      }
    });

    recommendedCollections?.forEach((collection) => {
      if ('active' in collection && !collection.active) {
        if (collection.newer_version) {
          localDispatch({ type: 'addOutdatedRecommendation', collection });
        } else {
          localDispatch({ type: 'addInvalidRecommendation', collection });
        }
      }
    });
  }, [subscribedCollections, recommendedCollections, localDispatch]);

  /**
   * Display/Hide the Modal and invoke the open/close functions
   * passed in from the parent component.
   */
  useEffect(() => {
    if (
      state.collectionsWithInvalidRecommendations.length ||
      state.collectionsWithOutdatedRecommendations.length ||
      state.collectionsWithInvalidSubscriptions.length ||
      state.collectionsWithOutdatedSubscriptions.length
    ) {
      if (!isModalOpen) {
        // We only want to open the modal if it isn't already.
        setIsModalOpen(true);
        onOpen();
      }
    } else if (collectionsProcessed && isModalOpen) {
      setIsModalOpen(false);
      onClose();
    }
  }, [state, collectionsProcessed]);

  return (
    <SolidTopModalWithCustomHeaderText
      isVisible={isModalOpen}
      cancelAction={() => null}
      completionAction={() => setCollectionsProcessed(true)}
      animationIn='bounceIn'
      animationInDuration={2000}
      animationOut='bounceOut'
      animationOutDuration={1000}
      gradientStart={MasterStyles.officialColors.brightSkyShade2}
      gradientEnd={MasterStyles.officialColors.mermaidShade2}
      contentComponent={InactiveCollectionContent}
      extraProps={{
        state,
        localDispatch,
      }}
    />
  );
}

function InactiveCollectionContent({
  acceptAction,
  containerHeight,
  extraProps,
}: {
  acceptAction: () => void;
  containerHeight: number;
  extraProps: {
    state: reducerState;
    localDispatch: (action: reducerAction) => void;
  };
}) {
  const [contentHeight, setContentHeight] = useState(0);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const username = useSelector(
    (state: RootReduxType) => state.auth.user.first_name
  );

  const collectionSubscriptions = useSelector(
    (state: RootReduxType) => state.workflows.collectionSubscriptions
  );
  const collectionRecommendations = useSelector(
    (state: RootReduxType) => state.workflows.collectionRecommendations
  );

  const dispatch = useDispatch();

  useEffect(() => {
    contentHeight + controlsHeight > containerHeight
      ? setScrollViewHeight(contentHeight + controlsHeight)
      : setScrollViewHeight(containerHeight);
  }, [contentHeight, controlsHeight, containerHeight]);

  /**
   * Upgrade eligible recommendations and subscriptions
   * to the newest version of relevant workflow collections.
   */
  const upgradeRecommendationsAndSubscriptions = () => {
    extraProps.state.collectionsWithOutdatedRecommendations.forEach(
      (collection) => {
        const recommendation = collectionRecommendations?.find(
          (recommendation) =>
            recommendation.workflow_collection === collection.detail
        );

        if (recommendation) {
          // Mark the old recommendation as ended
          dispatch(
            updateWorkflowCollectionRecommendation(recommendation, {
              end: moment().format(),
            })
          );

          // Create the new recommendation
          dispatch(
            createWorkflowCollectionRecommendation({
              workflow_collection: collection.newer_version,
              start: moment().format(),
            })
          );

          extraProps.localDispatch({
            type: 'removeOutdatedRecommendation',
            collection,
          });
        }
      }
    );

    extraProps.state.collectionsWithOutdatedSubscriptions.forEach(
      (collection) => {
        const subscription = collectionSubscriptions?.find(
          (subscription) =>
            subscription.workflow_collection === collection.detail
        );

        if (subscription) {
          // Disable Old Subscription
          dispatch(
            updateWorkflowCollectionSubscription(subscription, false, [])
          );

          // Create New Subscription
          dispatch(
            createWorkflowCollectionSubscription(
              collection.newer_version,
              subscription.workflowcollectionsubscriptionschedule_set
            )
          );

          // Remove this subscription from the list of items
          // to modify.
          extraProps.localDispatch({
            type: 'removeOutdatedSubscription',
            collection,
          });
        }
      }
    );
  };

  /**
   * Disable/inactivate recommendations and subscriptions
   * for inactive collections that don't have a newer version.
   */
  const removeRecommendationsAndSubscriptions = () => {
    extraProps.state.collectionsWithInvalidRecommendations.forEach(
      (collection) => {
        const recommendation = collectionRecommendations?.find(
          (recommendation) =>
            recommendation.workflow_collection === collection.detail
        );

        if (recommendation) {
          dispatch(
            updateWorkflowCollectionRecommendation(recommendation, {
              end: moment().format(),
            })
          );
        }

        extraProps.localDispatch({
          type: 'removeInvalidRecommendation',
          collection,
        });
      }
    );

    extraProps.state.collectionsWithInvalidSubscriptions.forEach(
      (collection) => {
        const subscription = collectionSubscriptions?.find(
          (subscription) =>
            subscription.workflow_collection === collection.detail
        );

        if (subscription) {
          // Disable Old Subscription
          dispatch(
            updateWorkflowCollectionSubscription(subscription, false, [])
          );

          // Remove this subscription from the list of items
          // to modify.
          extraProps.localDispatch({
            type: 'removeInvalidSubscription',
            collection,
          });
        }
      }
    );
  };

  const renderUpdatedCollections = () => {
    if (
      !extraProps.state.collectionsWithOutdatedRecommendations.length &&
      !extraProps.state.collectionsWithOutdatedSubscriptions.length
    ) {
      return null;
    }

    return (
      <View>
        <Text
          style={{
            ...MasterStyles.fontStyles.modalBody,
            textAlign: 'left',
            paddingTop: 25,
          }}
        >
          The following practices have been improved and you will now receive
          the new versions:
        </Text>
        {Array.from(
          new Set([
            ...extraProps.state.collectionsWithOutdatedRecommendations,
            ...extraProps.state.collectionsWithOutdatedSubscriptions,
          ])
        ).map((collection) => (
          <View
            key={collection.code}
            style={{
              marginTop: 10,
              borderColor: MasterStyles.officialColors.cloudy,
              borderWidth: 1,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBodySmall,
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}
            >
              {collection.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRemovedCollections = () => {
    if (
      !extraProps.state.collectionsWithInvalidRecommendations.length &&
      !extraProps.state.collectionsWithInvalidSubscriptions.length
    ) {
      return null;
    }

    return (
      <View>
        <Text
          style={{
            ...MasterStyles.fontStyles.modalBody,
            textAlign: 'left',
            paddingTop: 25,
          }}
        >
          The following practices are no longer available:
        </Text>
        {Array.from(
          new Set([
            ...extraProps.state.collectionsWithInvalidRecommendations,
            ...extraProps.state.collectionsWithInvalidSubscriptions,
          ])
        ).map((collection) => (
          <View
            key={collection.code}
            style={{
              marginTop: 10,
              borderColor: MasterStyles.officialColors.cloudy,
              borderWidth: 1,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBodySmall,
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}
            >
              {collection.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ height: containerHeight }}
        contentContainerStyle={{
          minHeight: containerHeight,
          ...MasterStyles.common.horizontalPadding25,
        }}
        scrollEnabled={scrollViewHeight > containerHeight}
      >
        <View
          key='content'
          onLayout={(event) =>
            setContentHeight(event.nativeEvent.layout.height)
          }
          style={{ flex: 1 }}
        >
          <View key='titleAndSubtitle' style={{ paddingBottom: 35 }}>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalTitle,
                textAlign: 'left',
              }}
            >
              Important Updates
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              Hi {username}, we've made some updates to our wellbeing practices.
            </Text>
            {renderUpdatedCollections()}
            {renderRemovedCollections()}
          </View>
        </View>
        <View
          onLayout={(event) =>
            setControlsHeight(event.nativeEvent.layout.height)
          }
        >
          <StylizedButton
            onPress={() => {
              upgradeRecommendationsAndSubscriptions();
              removeRecommendationsAndSubscriptions();
              acceptAction();
            }}
            text='Ok'
            textColor={MasterStyles.officialColors.density}
            outlineColor={MasterStyles.officialColors.density}
            additionalContainerStyles={{ maxHeight: 50 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
