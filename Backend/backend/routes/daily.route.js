import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createRoom,
  myRooms,
  getRoomByName,
  createRoomToken
} from "../controllers/Daily.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/daily/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Daily]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: hot-room
 *                 description: Name of the room
 *               privacy:
 *                 type: string
 *                 example: public
 *                 description: Privacy of the room
 *                 enum: [public, private]
 *                 default: public
 *               properties:
 *                 type: object
 *                 example: {}
 *                 description: Properties of the room
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       example: e0f4d14b-aa66-4af5-b631-4e39e3aeee07
 *                       description: Room ID
 *                     name:
 *                       type: string
 *                       example: hot-room
 *                       description: Name of the room
 *                     api_created:
 *                       type: boolean
 *                       example: true
 *                       description: Indicates if the room was created via API
 *                     privacy:
 *                       type: string
 *                       example: public
 *                       description: Privacy of the room
 *                     url:
 *                       type: string
 *                       example: https://sharelife.daily.co/hot-room
 *                       description: URL of the room
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-15T00:48:11.000Z
 *                       description: Creation timestamp
 *                     config:
 *                       type: object
 *                       example: {}
 *                       description: Configuration of the room
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: invalid-request-error
 *                   description: Error type
 *                 info:
 *                   type: string
 *                   example: a room named hot-room1 already exists
 *                   description: Error information
 */
router.post("/rooms", verifyToken, createRoom);

/**
 * @swagger
 * /api/daily/myRooms:
 *  get:
 *    summary: Get all rooms created by the user
 *    tags: [Daily]
 *    responses:
 *       200:
 *         description: Rooms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "49b86388-b9e2-4c43-bb59-9c496aa32327"
 *                   userId:
 *                     type: string
 *                     example: "860c0d39-8b54-42b8-9b70-479b1bf8f799"
 *                   roomName:
 *                     type: string
 *                     example: "kokiii"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-16T22:01:19.357Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-16T22:01:19.357Z"
 */
router.get("/myRooms", verifyToken, myRooms);

/**
 * @swagger
 * /api/daily/room/{roomName}:
 *   get:
 *     summary: Get room by name
 *     tags: [Daily]
 *     parameters:
 *       - in: path
 *         name: roomName
 *         required: true
 *         description: Name of the room
 *         schema:
 *           type: string
 *           example: hot-room
 *           default: hot-room
 *           format: string
 *           minLength: 1
 *           maxLength: 100
 *           pattern: "^[a-zA-Z0-9-_]*$"
 *     responses:
 *       200:
 *         description: Room fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "49b86388-b9e2-4c43-bb59-9c496aa32327"
 *                 userId:
 *                   type: string
 *                   example: "860c0d39-8b54-42b8-9b70-479b1bf8f799"
 *                 roomName:
 *                   type: string
 *                   example: "kokiii"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T22:01:19.357Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T22:01:19.357Z"
 */
router.get("/room/:roomName", verifyToken, getRoomByName);

/**
 * @swagger
 * /api/daily/roomToken:
 *  post:
 *    summary: Create a room token
 *    tags: [Daily]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              room_name:
 *                type: string
 *                example: hot-room
 *                description: The room for which this token is valid. If room_name isn't set, the token is valid for all rooms in your domain. *You should always set room_name if you are using this token to control access to a meeting.
 *                minLength: 1
 *                maxLength: 100
 *                pattern: "^[a-zA-Z0-9-_]*$"
 *                required: true
 *                default: hot-room
 *                format: string
 *              eject_at_token_exp:
 *                type: boolean
 *                description: Kick this user out of the meeting at the time this meeting token expires. If either this property or eject_after_elapsed are set for the token, the room's eject properties are overridden.
 *                default: false
 *              eject_after_elapsed:
 *                type: integer
 *                description: Kick this user out of the meeting this many seconds after they join the meeting. If either this property or eject_at_token_exp are set for the token, the room's eject properties are overridden.
 *              nbf:
 *                type: integer
 *                description: \"Not before\". This is a unix timestamp (seconds since the epoch.) Users cannot join a meeting in with this token before this time.
 *              exp:
 *                type: integer
 *                description: \"Expires\". This is a unix timestamp (seconds since the epoch.) Users cannot join a meeting with this token after this time.
 *              is_owner:
 *                type: boolean
 *                description: The user has meeting owner privileges. For example, if the room is configured for owner_only_broadcast and used in a Daily Prebuilt call, this user can send video, and audio, and can screenshare.
 *                default: false
 *              user_name:
 *                type: string
 *                description: The user's name in this meeting. The name displays in the user interface when the user is muted or has turned off the camera, and in the chat window. This username is also saved in the meeting events log (meeting events are retrievable using the analytics API methods.)
 *              user_id:
 *                type: string
 *                description: The user's ID for this meeting session. During a session, this ID is retrievable in the participants() method and related participant events. Either during or after a session concludes, this ID is retrievable using the /meetings REST API endpoint. You can use user_id to map between your user database and meeting events/attendance.
 *              enable_screenshare:
 *                type: boolean
 *                description: Sets whether or not the user is allowed to screen share. This setting applies for the duration of the meeting. If you're looking to dynamically control whether a user can screen share during a meeting, then use the permissions token property.
 *                default: true
 *              start_video_off:
 *                type: boolean
 *                description: Disable the default behavior of automatically turning on a participant's camera on a direct join() (i.e. without startCamera() first).
 *                default: false
 *              start_audio_off:
 *                type: boolean
 *                description: Disable the default behavior of automatically turning on a participant's microphone on a direct join() (i.e. without startCamera() first).
 *                default: false
 *              enable_recording:
 *                type: string
 *                description: Jump to recording docs.
 *                enum: ["cloud", "local", "raw-tracks"]
 *              enable_prejoin_ui:
 *                type: boolean
 *                description: Determines whether the participant using the meeting token enters a waiting room with a camera, mic, and browser check before joining a call. If this property is also set in the room or domain's configuration, the meeting token's configuration will take priority.
 *              enable_live_captions_ui:
 *                type: boolean
 *                description: Sets whether the participant sees a closed captions button in their Daily Prebuilt call tray. When the closed caption button is clicked, closed captions are displayed locally.
 *              enable_recording_ui:
 *                type: boolean
 *                description: Determines whether the participant using the meeting token can see the Recording button in Daily Prebuilt's UI, which can be found in the video call tray. If this value is false, the button will not be included in the tray. If it's true, the Recording button will be displayed.
 *              enable_terse_logging:
 *                type: boolean
 *                description: Reduces the volume of log messages. This feature should be enabled when there are more than 200 participants in a meeting to help improve performance.
 *                default: false
 *              start_cloud_recording:
 *                type: boolean
 *                description: Start cloud recording when the user joins the room. This can be used to always record and archive meetings, for example in a customer support context.
 *                default: false
 *              start_cloud_recording_opts:
 *                type: object
 *                description: Options for use when start_cloud_recording is true. See startRecording for available options.
 *              auto_start_transcription:
 *                type: boolean
 *                description: Start transcription when an owner joins the room. This property can be used to always transcribe meetings once an owner joins.
 *                default: false
 *              close_tab_on_exit:
 *                type: boolean
 *                description: (For meetings that open in a separate browser tab.) When a user leaves a meeting using the button in the in-call menu bar, the browser tab closes. This can be a good way, especially on mobile, for users to be returned to a previous website flow after a call.
 *                default: false
 *              redirect_on_meeting_exit:
 *                type: string
 *                description: (For meetings that open in a separate browser tab.) When a user leaves a meeting using the button in the in-call menu bar, the browser loads this URL. A query string that includes a parameter of the form recent-call=<domain>/<room> is appended to the URL. On mobile, you can redirect to a deep link to bring a user back into your app.
 *              lang:
 *                type: string
 *                description: The default language of the Daily prebuilt video call UI, for this room.
 *                enum: ["da", "de", "en", "es", "fi", "fr", "it", "jp", "ka", "nl", "no", "pt", "pt-BR", "pl", "ru", "sv", "tr", "user"]
 *                default: en
 *              permissions:
 *                type: object
 *                description: Specifies the initial default permissions for a non-meeting-owner participant joining a call.
 *                properties:
 *                  hasPresence:
 *                    type: boolean
 *                    description: Whether the participant appears as "present" in the call, i.e. whether they appear in participants().
 *                  canSend:
 *                    type: [boolean, array]
 *                    description: Which types of media a participant should be permitted to send.
 *                  canAdmin:
 *                    type: [boolean, array]
 *                    description: Which admin tasks a participant is permitted to do.
 *    responses:
 *      200:
 *        description: Room token created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkIjoiNTY5N2M1YzgtNDYzMi00NzI0LTk4NzgtOTRmZWRiODIwOWRlIiwiaWF0IjoxNzQyMjE2NTgxfQ.VvxQ5IpHTqaTdsilWKl-hvAjMVuRE-fCDZ-24yB3TCg"
 *                  description: Room token
 *                  format: string
 *                  minLength: 1
 *                  maxLength: 100
 *                  pattern: "^[a-zA-Z0-9-_]*$"
 *                  required: true
 */
router.post("/roomToken", verifyToken, createRoomToken);

export default router;