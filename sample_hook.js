import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {connect} from 'socket.io-client';
import {
  addCommentsToConversations,
  removeReaction,
} from '../Store/Comments/comments.slice';
import {
  editCurrentCommunity,
  editSpeaker,
  markLivePostAsArchived,
} from '../Store/Community/Community.slice';
import {updateCommunity} from '../Store/Profile/profile.slice';
import {CommentModel} from '../models/comment.model';
import {CommunityModel} from '../models/community.model';
import {ConversationModel} from '../models/conversation.model';
import {SpeakerModel} from '../models/speaker.model';
import {
  API_BASE_URL_SOCKET_COMMENT,
  API_BASE_URL_SOCKET_COMMUNITIES,
} from '../services/api.service';

const useSockets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    initializeSocketsForComments();
    initializeSocketsForConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initializeSocketsForConversation() {
    const socketCommunities = connect(API_BASE_URL_SOCKET_COMMUNITIES);
    socketCommunities.on('connect', () => {
      console.log('socket is connected');
    });
    socketCommunities.on('conversation-created', data => {
      dispatch(
        editCurrentCommunity({
          chatRoomId: data.communityId,
          conversations: [new ConversationModel(data.conversation)],
        }),
      );
      dispatch(
        editSpeaker({
          chatRoomId: data.communityId,
          speaker: undefined,
          nextSpeaker: undefined,
        }),
      );
    });

    socketCommunities.on('speaker-changed', data => {
      console.log('[speaker changed via v2 sockets]');
      dispatch(
        editSpeaker({
          chatRoomId: data.communityId,
          speaker: new SpeakerModel(data.speaker),
        }),
      );

      dispatch(
        markLivePostAsArchived({
          chatRoomId: data.communityId,
        }),
      );
    });

    socketCommunities.on('conversation-updated', data => {
      console.log('[socket v2] - conversation updated');
      dispatch(
        editCurrentCommunity({
          chatRoomId: data.communityId,
          conversations: [new ConversationModel(data.conversation)],
        }),
      );
    });

    socketCommunities.on('community-archived', data => {
      const community = new CommunityModel(data.community);
      community.archived = true;
      dispatch(updateCommunity(data.community));
    });

    socketCommunities.on('community-unarchived', data => {
      const community = new CommunityModel(data.community);
      community.archived = false;
      dispatch(updateCommunity(data.community));
    });
  }

  async function initializeSocketsForComments() {
    const socketComments = connect(API_BASE_URL_SOCKET_COMMENT);
    // const socketCommunity = connect(API_BASE_URL_SOCKET_CHATROOM);
    socketComments.on('connect', () => {
      console.log('socket is connected');
    });
    socketComments.on('updated-comment', data => {
      dispatch(
        addCommentsToConversations({
          conversationId: data.conversationId,
          comments: [new CommentModel(data.comment)],
        }),
      );
      console.log('update comment', data);
    });
    socketComments.on('added-comment', data => {
      console.log('[added comment via v2 sockets]');
      dispatch(
        addCommentsToConversations({
          conversationId: data.conversationId,
          comments: data.comments.map((_: any) => new CommentModel(_)),
        }),
      );
    });
    socketComments.on('deleted-comment', data => {
      console.log('[deleted comment via v2 sockets]');
    });
    socketComments.on('userReaction_added', data => {
      console.log('[added reaction via v2 sockets]');
      dispatch(
        addCommentsToConversations({
          conversationId: data.conversationId,
          comments: [new CommentModel(data.comment)],
        }),
      );
    });
    socketComments.on('userReaction_removed', data => {
      console.log('[removed comment via v2 sockets]');
      const {conversationId, commentId, userReactionId} = data;
      dispatch(
        removeReaction({
          conversationId: conversationId,
          commentId: commentId,
          userReactionId: userReactionId,
        }),
      );
    });
  }

  return null;
};
export default useSockets;
