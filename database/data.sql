SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 3jAbXtuNOhWfyK6XIHJzd6peA6MBEpmSI9k8EFDqoBeVVZljrr1H6kbSbRCqdD8

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
d6bfa531-01df-457f-b0f4-614937084eb3	\N	3d7e4ce0-7a42-452c-91a0-f3de7fffc091	s256	-AXy97gqSweNQvzmrxY_tKCII2CIGpWGnM0pBWueTwA	google			2026-06-14 13:28:52.250751+00	2026-06-14 13:28:52.250751+00	oauth	\N	\N	http://localhost:3000/auth/callback	\N	\N	f
c8ee671c-c443-4ff8-b693-8170a25ec4bb	\N	4b933bf1-96a9-4365-a65b-9378d09d2fab	s256	dkRRz_xmUwXt6uqbBCdjwoMjN1EtcyWJJ5KSc4-_RR8	google			2026-06-14 13:29:00.014439+00	2026-06-14 13:29:00.014439+00	oauth	\N	\N	http://localhost:3000/auth/callback	\N	\N	f
7f8edcf8-3ddd-4c36-ae38-e7ca695f86fd	\N	d94b401b-c559-4731-b0c3-3a3f74a45d00	s256	q8gkVuSYCXcRkjDlO1-vxtLzDxcEN-v4MTCFlP8jepk	google			2026-06-14 13:31:44.099533+00	2026-06-14 13:31:44.099533+00	oauth	\N	\N	http://localhost:3000/auth/callback	\N	\N	f
3947926e-488b-431e-8d49-d8521d569c61	4d4dbcaf-101e-4364-aa8a-0e98e9f5b490	f2eeb7a1-8492-4af2-bcdb-28bcde49139b	s256	PHmHOSMaNNKrTd_2gCN2zimjXbY83gyif6djeuDr8P8	email			2026-06-19 08:44:03.367569+00	2026-06-19 08:44:03.367569+00	email/signup	\N	\N	\N	\N	\N	f
1e3c6e59-0a04-4caf-afa5-5b559f252c80	\N	3216d488-37da-4237-a61e-587fd1969fc6	s256	-xk72Z44L8DmUkQzaPwfS9i9qsU_QzjNa5CX5JwifC0	google			2026-06-22 09:57:08.971471+00	2026-06-22 09:57:08.971471+00	oauth	\N	\N	http://localhost:3000/auth/callback	\N	\N	f
1cd4036d-41f4-4c04-b4f3-79cf438c5c9d	\N	83ac6163-de20-4b85-865b-1402c7700536	s256	U17ufQSaCLkEql8fBNhd9jtMWJ-uminvVudPL6WPXv8	google			2026-06-22 09:59:40.192191+00	2026-06-22 09:59:40.192191+00	oauth	\N	\N	http://localhost:3000/auth/callback	\N	\N	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	ddce8b62-7fb6-4ee0-be7c-719961ca3c0b	authenticated	authenticated	modesytest_102184@gmail.com	$2a$10$mQj7cK63sWC.2O0lrQlBQOihUIb/G1AgkUPm0FIjHK7oHYyiZELem	\N	\N	753de2ea6357038321bf245a495fec031ac1aed5e08bc89cf6f88ec1	2026-06-24 03:52:05.177492+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "ddce8b62-7fb6-4ee0-be7c-719961ca3c0b", "email": "modesytest_102184@gmail.com", "full_name": "Test User", "last_name": "User", "first_name": "Test", "email_verified": false, "phone_verified": false}	\N	2026-06-24 03:52:05.172849+00	2026-06-24 03:52:06.847695+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	02b6be74-dd0a-4e3d-8269-b1b513151dd8	authenticated	authenticated	overskull2112@gmail.com	\N	2026-06-24 04:11:49.299371+00	\N		\N		\N			\N	2026-06-24 04:11:55.027077+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "111569048852463754183", "name": "Rifqi Abdillah", "email": "overskull2112@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJHvKxbCfWISV0hPaA68Sir0HVY52obm3qa68lSl97mPG0WvA=s96-c", "full_name": "Rifqi Abdillah", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJHvKxbCfWISV0hPaA68Sir0HVY52obm3qa68lSl97mPG0WvA=s96-c", "provider_id": "111569048852463754183", "email_verified": true, "phone_verified": false}	\N	2026-06-24 04:11:49.278088+00	2026-06-26 06:42:49.317916+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
ddce8b62-7fb6-4ee0-be7c-719961ca3c0b	ddce8b62-7fb6-4ee0-be7c-719961ca3c0b	{"sub": "ddce8b62-7fb6-4ee0-be7c-719961ca3c0b", "email": "modesytest_102184@gmail.com", "full_name": "Test User", "last_name": "User", "first_name": "Test", "email_verified": false, "phone_verified": false}	email	2026-06-24 03:52:05.175429+00	2026-06-24 03:52:05.175472+00	2026-06-24 03:52:05.175472+00	2348a0ea-4ee1-42d7-9c22-dd0c3032e760
111569048852463754183	02b6be74-dd0a-4e3d-8269-b1b513151dd8	{"iss": "https://accounts.google.com", "sub": "111569048852463754183", "name": "Rifqi Abdillah", "email": "overskull2112@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJHvKxbCfWISV0hPaA68Sir0HVY52obm3qa68lSl97mPG0WvA=s96-c", "full_name": "Rifqi Abdillah", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJHvKxbCfWISV0hPaA68Sir0HVY52obm3qa68lSl97mPG0WvA=s96-c", "provider_id": "111569048852463754183", "email_verified": true, "phone_verified": false}	google	2026-06-24 04:11:49.294305+00	2026-06-24 04:11:49.294356+00	2026-06-24 04:11:49.294356+00	e526dea2-9477-4946-b6df-f7e0cfe0df67
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
89d2b981-e3ee-4560-a7ca-a45c1513d5d5	02b6be74-dd0a-4e3d-8269-b1b513151dd8	2026-06-24 04:11:55.029184+00	2026-06-26 06:49:14.26006+00	\N	aal1	\N	2026-06-26 06:49:14.259958	node	203.78.112.245	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
89d2b981-e3ee-4560-a7ca-a45c1513d5d5	2026-06-24 04:11:55.056689+00	2026-06-24 04:11:55.056689+00	oauth	8d336547-2288-4afb-b4d5-ba9bf63ebedb
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
542f5f60-ac5b-471f-b927-e2cd0414b39d	ddce8b62-7fb6-4ee0-be7c-719961ca3c0b	confirmation_token	753de2ea6357038321bf245a495fec031ac1aed5e08bc89cf6f88ec1	modesytest_102184@gmail.com	2026-06-24 03:52:06.854474	2026-06-24 03:52:06.854474
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	4	x3er2umrm4bj	02b6be74-dd0a-4e3d-8269-b1b513151dd8	t	2026-06-24 04:11:55.042188+00	2026-06-25 16:47:49.518352+00	\N	89d2b981-e3ee-4560-a7ca-a45c1513d5d5
00000000-0000-0000-0000-000000000000	5	zmghclo6p3ro	02b6be74-dd0a-4e3d-8269-b1b513151dd8	t	2026-06-25 16:47:49.529301+00	2026-06-26 06:42:49.304551+00	x3er2umrm4bj	89d2b981-e3ee-4560-a7ca-a45c1513d5d5
00000000-0000-0000-0000-000000000000	6	soitep3qstgo	02b6be74-dd0a-4e3d-8269-b1b513151dd8	f	2026-06-26 06:42:49.314522+00	2026-06-26 06:42:49.314522+00	zmghclo6p3ro	89d2b981-e3ee-4560-a7ca-a45c1513d5d5
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."brands" ("id", "name", "slug", "logo_path", "status", "created_at") FROM stdin;
1	Adidas	adidas	\N	t	2026-06-23 01:43:26.767133+00
2	Armani	armani	\N	t	2026-06-23 01:43:26.767133+00
3	Burberry	burberry	\N	t	2026-06-23 01:43:26.767133+00
4	Diesel	diesel	\N	t	2026-06-23 01:43:26.767133+00
5	Gucci	gucci	\N	t	2026-06-23 01:43:26.767133+00
6	Hugo Boss	hugo-boss	\N	t	2026-06-23 01:43:26.767133+00
7	H & M	h-and-m	\N	t	2026-06-23 01:43:26.767133+00
8	Lacoste	lacoste	\N	t	2026-06-23 01:43:26.767133+00
9	Lee Cooper	lee-cooper	\N	t	2026-06-23 01:43:26.767133+00
10	Mango	mango	\N	t	2026-06-23 01:43:26.767133+00
11	Nike	nike	\N	t	2026-06-23 01:43:26.767133+00
12	Levi's	levis	\N	t	2026-06-23 01:43:26.767133+00
13	Puma	puma	\N	t	2026-06-23 01:43:26.767133+00
14	U.S. Polo Assn	us-polo-assn	\N	t	2026-06-23 01:43:26.767133+00
15	Tommy Hilfiger	tommy-hilfiger	\N	t	2026-06-23 01:43:26.767133+00
16	Dockers	dockers	\N	t	2026-06-23 01:43:26.767133+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."categories" ("id", "slug", "image_path", "status", "created_at", "parent_id") FROM stdin;
1	clothing	\N	t	2026-06-23 01:47:50.752721+00	\N
2	shoes	\N	t	2026-06-23 01:47:50.752721+00	\N
3	home-living	\N	t	2026-06-23 01:47:50.752721+00	\N
4	jewelry-accessories	\N	t	2026-06-23 01:47:50.752721+00	\N
5	toys-entertainment	\N	t	2026-06-23 01:47:50.752721+00	\N
6	graphics-photos	\N	t	2026-06-23 01:47:50.752721+00	\N
7	video-audio	\N	t	2026-06-23 01:47:50.752721+00	\N
8	web-templates-code	\N	t	2026-06-23 01:47:50.752721+00	\N
9	womens-clothing	\N	t	2026-06-23 01:47:59.007379+00	1
10	mens-clothing	\N	t	2026-06-23 01:47:59.007379+00	1
11	kids-clothing	\N	t	2026-06-23 01:47:59.007379+00	1
12	womens-shoes	\N	t	2026-06-23 01:47:59.007379+00	2
13	mens-shoes	\N	t	2026-06-23 01:47:59.007379+00	2
14	kids-shoes	\N	t	2026-06-23 01:47:59.007379+00	2
15	home-decor	\N	t	2026-06-23 01:47:59.007379+00	3
16	furniture	\N	t	2026-06-23 01:47:59.007379+00	3
17	office	\N	t	2026-06-23 01:47:59.007379+00	3
18	outdoor-gardening	\N	t	2026-06-23 01:47:59.007379+00	3
19	painting	\N	t	2026-06-23 01:47:59.007379+00	3
20	bags-purses	\N	t	2026-06-23 01:47:59.007379+00	4
21	necklaces-accessories	\N	t	2026-06-23 01:47:59.007379+00	4
22	rings	\N	t	2026-06-23 01:47:59.007379+00	4
23	musical-instruments	\N	t	2026-06-23 01:47:59.007379+00	5
24	video-games	\N	t	2026-06-23 01:47:59.007379+00	5
25	toys	\N	t	2026-06-23 01:47:59.007379+00	5
26	headphones	\N	t	2026-06-23 01:47:59.007379+00	5
27	magazines	\N	t	2026-06-23 01:47:59.007379+00	5
28	movies	\N	t	2026-06-23 01:47:59.007379+00	5
29	books	\N	t	2026-06-23 01:47:59.007379+00	5
30	graphics	\N	t	2026-06-23 01:47:59.007379+00	6
31	web-elements	\N	t	2026-06-23 01:47:59.007379+00	6
32	logos	\N	t	2026-06-23 01:47:59.007379+00	6
33	photos	\N	t	2026-06-23 01:47:59.007379+00	6
34	after-effects	\N	t	2026-06-23 01:47:59.007379+00	7
35	premiere-pro	\N	t	2026-06-23 01:47:59.007379+00	7
36	music	\N	t	2026-06-23 01:47:59.007379+00	7
37	sound-effects	\N	t	2026-06-23 01:47:59.007379+00	7
38	wordpress-templates	\N	t	2026-06-23 01:47:59.007379+00	8
39	html-templates	\N	t	2026-06-23 01:47:59.007379+00	8
40	php-scripts	\N	t	2026-06-23 01:47:59.007379+00	8
41	plugins	\N	t	2026-06-23 01:47:59.007379+00	8
42	javascript-css	\N	t	2026-06-23 01:47:59.007379+00	8
43	dresses	\N	t	2026-06-23 01:48:31.025207+00	9
44	skirts	\N	t	2026-06-23 01:48:31.025207+00	9
45	pants-capris	\N	t	2026-06-23 01:48:31.025207+00	9
46	sweaters	\N	t	2026-06-23 01:48:31.025207+00	9
47	jackets-coats	\N	t	2026-06-23 01:48:31.025207+00	10
48	sweaters-47	\N	t	2026-06-23 01:48:31.025207+00	10
49	pants-jeans	\N	t	2026-06-23 01:48:31.025207+00	10
50	shirts	\N	t	2026-06-23 01:48:31.025207+00	10
51	sneakers-athletic-shoes	\N	t	2026-06-23 01:48:31.025207+00	12
52	boots	\N	t	2026-06-23 01:48:31.025207+00	12
53	sandals	\N	t	2026-06-23 01:48:31.025207+00	12
54	backpacks	\N	t	2026-06-23 01:48:31.025207+00	20
55	handbags	\N	t	2026-06-23 01:48:31.025207+00	20
56	pendants	\N	t	2026-06-23 01:48:31.025207+00	21
57	sun-hats	\N	t	2026-06-23 01:48:31.025207+00	21
58	scarfs	\N	t	2026-06-23 01:48:31.025207+00	21
59	decorative-pillows	\N	t	2026-06-23 01:48:31.025207+00	15
60	clocks	\N	t	2026-06-23 01:48:31.025207+00	15
61	vases	\N	t	2026-06-23 01:48:31.025207+00	15
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "full_name", "role", "avatar_url", "phone_number", "created_at", "updated_at") FROM stdin;
ddce8b62-7fb6-4ee0-be7c-719961ca3c0b	Test User	customer	\N	\N	2026-06-24 03:52:05.172527+00	2026-06-24 03:52:05.172527+00
02b6be74-dd0a-4e3d-8269-b1b513151dd8	Rifqi Abdillah	customer	https://lh3.googleusercontent.com/a/ACg8ocJHvKxbCfWISV0hPaA68Sir0HVY52obm3qa68lSl97mPG0WvA=s96-c	\N	2026-06-24 04:11:49.268077+00	2026-06-24 04:11:49.268077+00
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."vendors" ("id", "user_id", "shop_name", "shop_slug", "shop_logo", "shop_description", "balance", "custom_commission_rate", "is_verified", "status", "created_at", "updated_at") FROM stdin;
1	\N	Admin	admin	\N	Official Modesy store — curated quality products across all categories.	0.0000	\N	t	t	2026-06-23 01:44:11.370129+00	2026-06-23 01:44:11.370129+00
2	\N	Trendshop	daniel-jones	\N	Trendshop by Daniel Jones — timeless, modern, and feminine fashion pieces made with quality materials and craftsmanship.	0.0000	\N	t	t	2026-06-23 01:44:11.370129+00	2026-06-23 01:44:11.370129+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."products" ("id", "vendor_id", "category_id", "type", "slug", "price", "stock", "weight", "is_draft", "status", "created_at", "updated_at", "discount_percent", "is_featured", "brand_id") FROM stdin;
1	2	9	physical	summer-fashion-top-lace	65.0000	25	300	f	t	2026-06-25 07:06:19.73323+00	2026-06-25 07:06:19.73323+00	17	t	\N
2	2	9	physical	women-lace-blouse-multicolor	69.0000	30	280	f	t	2026-06-24 07:06:19.73323+00	2026-06-24 07:06:19.73323+00	12	f	\N
3	1	43	physical	floral-women-sundress	80.0000	20	350	f	t	2026-06-23 07:06:19.73323+00	2026-06-23 07:06:19.73323+00	10	t	\N
4	1	9	physical	women-casual-dress-red	99.0000	18	330	f	t	2026-06-22 07:06:19.73323+00	2026-06-22 07:06:19.73323+00	\N	f	\N
5	1	10	physical	cobalt-man-tshirt-all-colors	25.0000	60	180	f	t	2026-06-21 07:06:19.73323+00	2026-06-21 07:06:19.73323+00	\N	t	11
6	2	47	physical	men-outerwear-navy-color	89.0000	22	900	f	t	2026-06-20 07:06:19.73323+00	2026-06-20 07:06:19.73323+00	\N	t	4
7	1	13	physical	black-sneakers-white-sole	69.0000	32	850	f	t	2026-06-19 07:06:19.73323+00	2026-06-19 07:06:19.73323+00	22	t	11
8	2	12	physical	seychelles-ankle-bootie-brown	79.0000	19	720	f	t	2026-06-18 07:06:19.73323+00	2026-06-18 07:06:19.73323+00	\N	f	\N
9	1	52	physical	womens-ankle-boot-multicolor	59.0000	24	700	f	t	2026-06-17 07:06:19.73323+00	2026-06-17 07:06:19.73323+00	\N	f	\N
10	1	16	physical	modern-grey-couch-and-pillows	299.0000	8	25000	f	t	2026-06-16 07:06:19.73323+00	2026-06-16 07:06:19.73323+00	\N	t	\N
11	1	59	physical	handcrafted-decorative-pillow	59.0000	45	400	f	t	2026-06-15 07:06:19.73323+00	2026-06-15 07:06:19.73323+00	14	t	\N
12	2	59	physical	blanket-comfort-couch-pillow	39.0000	38	350	f	t	2026-06-14 07:06:19.73323+00	2026-06-14 07:06:19.73323+00	\N	f	\N
13	1	54	physical	gucci-nylon-smart-backpack	55.0000	16	600	f	t	2026-06-13 07:06:19.73323+00	2026-06-13 07:06:19.73323+00	5	t	5
14	1	55	physical	women-kipling-saddle-handbag	59.0000	21	450	f	t	2026-06-12 07:06:19.73323+00	2026-06-12 07:06:19.73323+00	14	t	\N
15	2	57	physical	sun-hat-women-protection-cap	29.0000	55	120	f	t	2026-06-11 07:06:19.73323+00	2026-06-11 07:06:19.73323+00	\N	f	\N
16	2	58	physical	colorful-women-scarves	40.0000	42	100	f	t	2026-06-10 07:06:19.73323+00	2026-06-10 07:06:19.73323+00	\N	t	\N
17	1	36	digital	moment-of-inspiration-piano-music	15.0000	999	\N	f	t	2026-06-09 07:06:19.73323+00	2026-06-09 07:06:19.73323+00	\N	f	\N
18	2	30	digital	animal-colorful-digital-prints	29.0000	999	\N	f	t	2026-06-08 07:06:19.73323+00	2026-06-08 07:06:19.73323+00	\N	f	\N
19	1	33	digital	adorable-animals-photo-pack	0.0000	999	\N	f	t	2026-06-07 07:06:19.73323+00	2026-06-07 07:06:19.73323+00	\N	f	\N
20	2	54	physical	custom-leather-travel-backpack	0.0000	10	700	f	t	2026-06-06 07:06:19.73323+00	2026-06-06 07:06:19.73323+00	\N	f	\N
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."cart_items" ("id", "user_id", "product_id", "quantity", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."languages" ("id", "name", "code", "text_direction", "is_default", "status", "created_at", "updated_at") FROM stdin;
1	English	en	ltr	t	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
2	Arabic	ar	rtl	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
\.


--
-- Data for Name: category_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."category_translations" ("id", "category_id", "language_id", "name") FROM stdin;
1	1	1	Clothing
2	2	1	Shoes
3	3	1	Home Living
4	4	1	Jewelry Accessories
5	5	1	Toys Entertainment
6	6	1	Graphics Photos
7	7	1	Video Audio
8	8	1	Web Templates Code
11	11	1	Kids Clothing
14	14	1	Kids Shoes
15	15	1	Home Decor
16	16	1	Furniture
17	17	1	Office
18	18	1	Outdoor Gardening
19	19	1	Painting
20	20	1	Bags Purses
21	21	1	Necklaces Accessories
22	22	1	Rings
23	23	1	Musical Instruments
24	24	1	Video Games
25	25	1	Toys
26	26	1	Headphones
27	27	1	Magazines
28	28	1	Movies
29	29	1	Books
30	30	1	Graphics
31	31	1	Web Elements
32	32	1	Logos
33	33	1	Photos
34	34	1	After Effects
35	35	1	Premiere Pro
36	36	1	Music
37	37	1	Sound Effects
38	38	1	Wordpress Templates
39	39	1	Html Templates
40	40	1	Php Scripts
41	41	1	Plugins
42	42	1	Javascript Css
43	43	1	Dresses
44	44	1	Skirts
45	45	1	Pants Capris
46	46	1	Sweaters
47	47	1	Jackets Coats
48	48	1	Sweaters 47
49	49	1	Pants Jeans
50	50	1	Shirts
51	51	1	Sneakers Athletic Shoes
52	52	1	Boots
53	53	1	Sandals
54	54	1	Backpacks
55	55	1	Handbags
56	56	1	Pendants
57	57	1	Sun Hats
58	58	1	Scarfs
59	59	1	Decorative Pillows
60	60	1	Clocks
61	61	1	Vases
9	9	1	Women's Clothing
10	10	1	Men's Clothing
12	12	1	Women's Shoes
13	13	1	Men's Shoes
62	1	2	الملابس
63	2	2	الأحذية
64	3	2	المنزل والمعيشة
65	4	2	المجوهرات والإكسسوارات
66	5	2	الألعاب والترفيه
67	6	2	الرسومات والصور
68	7	2	الفيديو والصوت
69	8	2	قوالب الويب والكود
70	9	2	ملابس نسائية
71	10	2	ملابس رجالية
72	11	2	ملابس أطفال
73	12	2	أحذية نسائية
74	13	2	أحذية رجالية
75	14	2	أحذية أطفال
76	15	2	ديكور المنزل
77	16	2	أثاث
78	17	2	مكتب
79	18	2	خارجي وحدائق
80	19	2	رسم
81	20	2	حقائب
82	21	2	قلادات وإكسسوارات
83	22	2	خواتم
84	23	2	آلات موسيقية
85	24	2	ألعاب فيديو
86	25	2	ألعاب
87	26	2	سماعات الرأس
88	27	2	مجلات
89	28	2	أفلام
90	29	2	كتب
91	30	2	رسومات
92	31	2	عناصر الويب
93	32	2	شعارات
94	33	2	صور
95	34	2	افتر إفكتس
96	35	2	بريمير برو
97	36	2	موسيقى
98	37	2	مؤثرات صوتية
99	38	2	قوالب ووردبريس
100	39	2	قوالب اتش تي ام ال
101	40	2	سكريبتات بي اتش بي
102	41	2	إضافات
103	42	2	جافاسكريبت وسي اس اس
104	43	2	فساتين
105	44	2	تنانير
106	45	2	بناطيل وكابري
107	46	2	سترات صوفية
108	47	2	جاكيتات ومعاطف
109	48	2	سترات صوفية رجالية
110	49	2	بناطيل وجينز
111	50	2	قمصان
112	51	2	أحذية رياضية
113	52	2	أحذية بوت
114	53	2	صنادل
115	54	2	حقائب ظهر
116	55	2	حقائب يد
117	56	2	قلادات
118	57	2	قبعات شمسية
119	58	2	أوشحة
120	59	2	وسائد ديكور
121	60	2	ساعات حائط
122	61	2	مزهريات
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."currencies" ("id", "name", "code", "symbol", "exchange_rate", "is_default", "status", "created_at", "updated_at") FROM stdin;
1	US Dollar	USD	$	1.000000	t	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
2	Euro	EUR	€	0.920000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
3	Brazilian Real	BRL	R$	5.050000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
4	British Pound	GBP	£	0.790000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
5	Indonesian Rupiah	IDR	Rp	16250.000000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
6	Indian Rupee	INR	₹	83.500000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
7	Nigerian Naira	NGN	₦	1580.000000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
8	Russian Ruble	RUB	₽	89.500000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
9	Turkish Lira	TRY	₺	32.100000	f	t	2026-06-14 12:29:44.631531+00	2026-06-14 12:29:44.631531+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("id", "user_id", "order_number", "total_price", "total_shipping_cost", "payment_status", "payment_method", "shipping_address", "created_at", "updated_at", "payment_intent_id", "session_id", "snap_token") FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."order_items" ("id", "order_id", "vendor_id", "product_id", "price", "quantity", "shipping_cost", "commission_amount", "vendor_earning", "order_status", "tracking_number", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_images" ("id", "product_id", "image_url", "is_main", "row_order", "created_at") FROM stdin;
1	1	https://picsum.photos/seed/product-1/600/600	t	0	2026-06-26 07:07:06.891116+00
2	2	https://picsum.photos/seed/product-2/600/600	t	0	2026-06-26 07:07:06.891116+00
3	3	https://picsum.photos/seed/product-3/600/600	t	0	2026-06-26 07:07:06.891116+00
4	4	https://picsum.photos/seed/product-4/600/600	t	0	2026-06-26 07:07:06.891116+00
5	5	https://picsum.photos/seed/product-5/600/600	t	0	2026-06-26 07:07:06.891116+00
6	6	https://picsum.photos/seed/product-6/600/600	t	0	2026-06-26 07:07:06.891116+00
7	7	https://picsum.photos/seed/product-7/600/600	t	0	2026-06-26 07:07:06.891116+00
8	8	https://picsum.photos/seed/product-8/600/600	t	0	2026-06-26 07:07:06.891116+00
9	9	https://picsum.photos/seed/product-9/600/600	t	0	2026-06-26 07:07:06.891116+00
10	10	https://picsum.photos/seed/product-10/600/600	t	0	2026-06-26 07:07:06.891116+00
11	11	https://picsum.photos/seed/product-11/600/600	t	0	2026-06-26 07:07:06.891116+00
12	12	https://picsum.photos/seed/product-12/600/600	t	0	2026-06-26 07:07:06.891116+00
13	13	https://picsum.photos/seed/product-13/600/600	t	0	2026-06-26 07:07:06.891116+00
14	14	https://picsum.photos/seed/product-14/600/600	t	0	2026-06-26 07:07:06.891116+00
15	15	https://picsum.photos/seed/product-15/600/600	t	0	2026-06-26 07:07:06.891116+00
16	16	https://picsum.photos/seed/product-16/600/600	t	0	2026-06-26 07:07:06.891116+00
17	17	https://picsum.photos/seed/product-17/600/600	t	0	2026-06-26 07:07:06.891116+00
18	18	https://picsum.photos/seed/product-18/600/600	t	0	2026-06-26 07:07:06.891116+00
19	19	https://picsum.photos/seed/product-19/600/600	t	0	2026-06-26 07:07:06.891116+00
20	20	https://picsum.photos/seed/product-20/600/600	t	0	2026-06-26 07:07:06.891116+00
21	1	https://picsum.photos/seed/product-1-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
22	2	https://picsum.photos/seed/product-2-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
23	3	https://picsum.photos/seed/product-3-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
24	4	https://picsum.photos/seed/product-4-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
25	5	https://picsum.photos/seed/product-5-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
26	6	https://picsum.photos/seed/product-6-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
27	7	https://picsum.photos/seed/product-7-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
28	8	https://picsum.photos/seed/product-8-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
29	9	https://picsum.photos/seed/product-9-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
30	10	https://picsum.photos/seed/product-10-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
31	11	https://picsum.photos/seed/product-11-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
32	12	https://picsum.photos/seed/product-12-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
33	13	https://picsum.photos/seed/product-13-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
34	14	https://picsum.photos/seed/product-14-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
35	15	https://picsum.photos/seed/product-15-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
36	16	https://picsum.photos/seed/product-16-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
37	17	https://picsum.photos/seed/product-17-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
38	18	https://picsum.photos/seed/product-18-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
39	19	https://picsum.photos/seed/product-19-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
40	20	https://picsum.photos/seed/product-20-alt/600/600	f	1	2026-06-26 07:07:21.468286+00
\.


--
-- Data for Name: product_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_options" ("id", "product_id", "name", "created_at") FROM stdin;
\.


--
-- Data for Name: product_option_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_option_values" ("id", "option_id", "value", "price_modifier", "stock") FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_reviews" ("id", "user_id", "product_id", "rating", "review", "created_at") FROM stdin;
\.


--
-- Data for Name: product_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."product_translations" ("id", "product_id", "language_id", "title", "description", "short_description") FROM stdin;
1	1	1	Summer Fashion Top Lace	A lightweight lace top perfect for warm-weather styling, easy to pair with skirts or jeans.	Lightweight lace top for summer
2	2	1	Women Lace Blouse Multicolor	A versatile lace blouse available in multiple colors, designed for both casual and semi-formal looks.	Versatile multicolor lace blouse
3	3	1	Floral Women Sundress	A breezy floral sundress made from soft breathable fabric, ideal for summer outings.	Breezy floral sundress
4	4	1	Women Casual Dress Red	A comfortable everyday dress in a bold red tone with a relaxed fit.	Comfortable red casual dress
5	5	1	Cobalt Man T-Shirt All Colors	A classic cotton t-shirt offered in a wide range of colors for everyday wear.	Classic cotton tee, multiple colors
6	6	1	Men Outerwear Navy Color	A warm navy outerwear jacket built for cooler seasons, with a tailored silhouette.	Warm navy outerwear jacket
7	7	1	Black Sneakers With White Sole	Everyday black sneakers with a clean white sole, combining comfort and style.	Black sneakers, white sole
8	8	1	Seychelles Ankle Bootie Brown	A brown ankle bootie with a sturdy heel, suited for both casual and dressed-up outfits.	Brown ankle bootie
9	9	1	Women's Ankle Boot Multicolor	An ankle boot available in several color options, built for all-day comfort.	Ankle boot, multiple colors
10	10	1	Modern Grey Couch and Pillows	A modern grey sofa set bundled with matching accent pillows for the living room.	Modern grey couch set
11	11	1	Handcrafted Decorative Pillow	A handcrafted decorative pillow that adds a luxurious touch to any room.	Handcrafted decorative pillow
12	12	1	Blanket Comfort Couch Pillow	A soft comfort pillow designed to pair with any couch or blanket set.	Comfort couch pillow
13	13	1	Gucci Nylon Fabric Smart Backpack	A durable nylon fabric backpack with smart compartments for daily essentials.	Durable nylon smart backpack
14	14	1	Women Kipling Bailey Saddle Handbag	A saddle-style handbag with a structured shape and adjustable strap.	Saddle-style handbag
15	15	1	Sun Hat For Women Protection Cap	A wide-brim sun hat offering reliable protection for outdoor days.	Wide-brim sun protection hat
16	16	1	Colorful Women Scarves	A set of colorful lightweight scarves suitable for layering in any season.	Colorful lightweight scarves
17	17	1	Moment of Inspiration Piano Music	An instrumental piano track designed for calm, reflective moments.	Calm instrumental piano track
18	18	1	Animal Colorful Digital Prints	A digital print pack featuring vivid, colorful animal illustrations.	Vivid animal digital prints
19	19	1	Adorable Animals Photo Pack	A free stock photo pack featuring a curated set of adorable animal images.	Free adorable animal photo pack
20	20	1	Custom Leather Travel Backpack	A made-to-order leather travel backpack — final price depends on chosen specifications.	Made-to-order leather backpack
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."wishlists" ("id", "user_id", "product_id", "created_at") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 6, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."brands_id_seq"', 16, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."cart_items_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 61, true);


--
-- Name: category_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_translations_id_seq"', 122, true);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."currencies_id_seq"', 9, true);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."languages_id_seq"', 2, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."order_items_id_seq"', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."orders_id_seq"', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_images_id_seq"', 40, true);


--
-- Name: product_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_option_values_id_seq"', 1, false);


--
-- Name: product_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_options_id_seq"', 1, false);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_reviews_id_seq"', 1, false);


--
-- Name: product_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_translations_id_seq"', 20, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 20, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vendors_id_seq"', 2, true);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."wishlists_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 3jAbXtuNOhWfyK6XIHJzd6peA6MBEpmSI9k8EFDqoBeVVZljrr1H6kbSbRCqdD8

RESET ALL;
