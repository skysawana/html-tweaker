/*1347421693,173217057*/

if (window.CavalryLogger) { CavalryLogger.start_js(["3Jyey"]); }

__d("MessagingEvents",["array-extensions","Arbiter","ChannelConstants","copyProperties","isEmpty"],function(a,b,c,d,e,f){b('array-extensions');var g=b('Arbiter'),h=b('ChannelConstants'),i=b('copyProperties'),j=b('isEmpty'),k={},l=new g();function m(n){if(!j(k))return;for(var o in n)l.inform('count/'+o,n[o]);}l.subscribe('mark-as-read',function(n,o){(o.tids||o.chat_ids||[]).forEach(function(p){p=''+p;if(!(p in k)){k[p]=true;var q=function(){l.unsubscribe(r);clearTimeout(s);delete k[p];},r=l.subscribe('read',function(t,u){if((u.tids||[]).contains(p)||(u.chat_ids||[]).contains(p))q();}),s=q.defer(60000);}});});g.subscribe(h.getArbiterType('messaging'),function(n,o){var p=i({},o.obj),event=p.event||'';delete p.type;delete p.event;l.inform(event,p);if('unread_counts' in p){var q=p.unread_counts;m({unread:q.inbox,other_unseen:q.other});}});g.subscribe(h.getArbiterType('inbox'),function(n,o){var p=i(o.obj);delete p.type;m(p);});a.MessagingEvents=e.exports=l;},3);
__d("FreeformTokenizerBehavior",["Input","Keys","event-extensions","function-extensions"],function(a,b,c,d,e,f){var g=b('Input'),h=b('Keys');b('event-extensions');b('function-extensions');function i(j,k){var l=k.tokenize_on_blur!==false,m=k.tokenize_on_paste!==false,n=k.matcher&&new RegExp(k.matcher,'i');function o(event){var p=g.getValue(j.getInput()).trim();if(p&&(!n||n.test(p))){var q={uid:p,text:p,freeform:true};j.addToken(j.createToken(q));if(event){j.getTypeahead().getCore().afterSelect();event.kill();}}}j.subscribe('keydown',function(p,q){var event=q.event,r=Event.getKeyCode(event);if(r==h.COMMA||r==h.RETURN){var s=j.getTypeahead().getView();if(s.getSelection()){s.select();event.kill();}else o(event);}});j.subscribe('paste',function(p,q){if(m)o.bind(null,q.event).defer(20);});j.subscribe('blur',function(p,q){if(l)o();j.getTypeahead().getCore().reset();});}e.exports=i;});
__d("MercuryFilters",["array-extensions","MercuryConstants"],function(a,b,c,d,e,f){b('array-extensions');var g=c('MercuryConstants'),h=[g.MessagingTag.UNREAD],i={ALL:'all',getSupportedFilters:function(){return h.concat();},isSupportedFilter:function(j){return h.contains(j);}};e.exports=i;});
__d("MercuryOrderedThreadlist",["JSLogger","MercuryFolders","MercuryFilters","MercuryServerRequests","RangedCallbackManager","MercuryThreadInformer","MercuryThreads","MercuryConstants"],function(a,b,c,d,e,f){var g=b('JSLogger'),h=b('MercuryFolders'),i=b('MercuryFilters'),j=b('MercuryServerRequests'),k=b('RangedCallbackManager'),l=b('MercuryThreadInformer'),m=b('MercuryThreads'),n=c('MercuryConstants'),o=g.create('ordered_threadlist_model'),p=i.getSupportedFilters().concat([i.ALL]),q=h.getSupportedFolders(),r={};q.forEach(function(ca){r[ca]={};p.forEach(function(da){r[ca][da]=new k(function(ea){return m.getThreadMetaNow(ea).timestamp;},function(ea,fa){return fa-ea;},j.canLinkExternally.bind(j));});});function s(ca,da,ea){var fa=[],ga=false,ha=false,ia=(ca||[]).filter(function(pa){var qa=pa.filter||i.ALL;return (pa.folder==da||(!pa.folder&&da==n.MessagingTag.INBOX))&&qa==ea;}),ja=r[da][ea].getAllResources(),ka;ia.forEach(function(pa){fa=fa.concat(pa.thread_ids);if(pa.error){if(pa.end>ja.length)ha=pa.error;}else{var qa=pa.end-pa.start;if(pa.thread_ids.length<qa)ga=true;}if(!ka||pa.end>ka)ka=pa.end;});w(fa,da,ea);if(ga){r[da][ea].setReachedEndOfArray();}else if(ha){r[da][ea].setError(ha);}else{var la=r[da][ea].getCurrentArraySize();if(ka&&la<ka){var ma={},na=ja.concat(fa),oa=na.filter(function(pa){var qa=ma[pa];ma[pa]=true;return qa;});if(oa.length){o.warn('duplicate_threads',{folder:da,expected_final_size:ka,actual_final_size:la,duplicate_thread_ids:oa});j.fetchThreadlistInfo(ka,oa.length,da,ea==i.ALL?null:ea);}}}}function t(ca){q.forEach(function(da){p.forEach(function(ea){s(ca,da,ea);});});}function u(ca){var da={};q.forEach(function(ea){da[ea]={};p.forEach(function(fa){da[ea][fa]={to_add:[],to_remove:[],to_remove_if_last_after_add:{}};});});ca.forEach(function(ea){if(ea.is_forward)return;var fa=ea.thread_id,ga=x(fa),ha=y(fa);function ia(){ha.forEach(function(ka){da[ga][ka].to_add.push(fa);if(!r[ga][ka].hasReachedEndOfArray()&&!r[ga][ka].hasResource(fa))da[ga][ka].to_remove_if_last_after_add[fa]=true;});}function ja(ka){if(p.contains(ka))if(ha.contains(ka)){da[ga][ka].to_add.push(fa);}else da[ga][ka].to_remove.push(fa);}if(!ga){if(ea.action_type===n.MercuryActionType.CHANGE_FOLDER||ea.action_type===n.MercuryActionType.CHANGE_ARCHIVED_STATUS)q.forEach(function(ka){if(ka!==ga)p.forEach(function(la){r[ka][la].removeResources([fa]);});});return;}switch(ea.action_type){case n.MercuryActionType.DELETE_THREAD:ha.forEach(function(ka){da[ga][ka].to_remove.push(fa);});break;case n.MercuryActionType.CHANGE_ARCHIVED_STATUS:case n.MercuryActionType.CHANGE_FOLDER:ia();break;case n.MercuryActionType.CHANGE_READ_STATUS:ja(n.MessagingTag.UNREAD);break;case n.MercuryActionType.USER_GENERATED_MESSAGE:case n.MercuryActionType.LOG_MESSAGE:ha.forEach(function(ka){if(z(fa,ga,ka))da[ga][ka].to_add.push(fa);});break;}});q.forEach(function(ea){p.forEach(function(fa){var ga=r[ea][fa];w(da[ea][fa].to_add,ea,fa);for(var ha=ga.getCurrentArraySize()-1;ha>=0;ha--){var ia=ga.getResourceAtIndex(ha);if(!da[ea][fa].to_remove_if_last_after_add[ia])break;da[ea][fa].to_remove.push(ia);}ga.removeResources(da[ea][fa].to_remove);});});}function v(ca){var da={};q.forEach(function(ea){da[ea]={};p.forEach(function(fa){da[ea][fa]=[];});});ca.forEach(function(ea){var fa=x(ea.thread_id),ga=y(ea.thread_id);ga.forEach(function(ha){if(fa&&z(ea.thread_id,fa,ha))da[fa][ha].push(ea.thread_id);});});q.forEach(function(ea){p.forEach(function(fa){if(da[ea][fa].length>0)w(da[ea][fa],ea,fa);});});}function w(ca,da,ea){ea=ea||i.ALL;r[da][ea].addResources(ca);q.forEach(function(fa){if(fa!=da)r[fa][ea].removeResources(ca);});}function x(ca){var da=m.getThreadMetaNow(ca),ea=null;if(!da){ea='No thread metadata';}else if(!da.folder)ea='No thread folder';if(ea){var fa={error:ea,tid:ca};o.warn('no_thread_folder',fa);return null;}var ga=da.folder;if(da.is_archived)ga=n.MessagingTag.ACTION_ARCHIVED;if(r[ga]){return ga;}else return null;}function y(ca){var da=m.getThreadMetaNow(ca),ea=[i.ALL];if(!da){var fa={error:'no_thread_metadata',tid:ca};o.warn('no_thread_metadata',fa);return [];}if(da.unread_count)ea.push(n.MessagingTag.UNREAD);return ea;}function z(ca,da,ea){var fa=m.getThreadMetaNow(ca);return fa&&fa.timestamp&&x(ca)==da&&y(ca).contains(ea);}var aa={getThreadlist:function(ca,da,ea,fa,ga,ha){return aa.getFilteredThreadlist(ca,da,ea,i.ALL,fa,ga,ha);},getFilteredThreadlist:function(ca,da,ea,fa,ga,ha,ia){var ja=r[ea][fa],ka=ja.executeOrEnqueue(ca,da,ga,ha),la=ja.getUnavailableResources(ka);if(la.length){if(ja.getCurrentArraySize()<ca){var ma={start:ca,limit:da,filter:fa,resources_size:ja.getCurrentArraySize()};o.warn('range_with_gap',ma);}j.fetchThreadlistInfo(ja.getCurrentArraySize(),la.length,ea,fa==i.ALL?null:fa,ia);}return ka;},getThreadlistUntilTimestamp:function(ca,da,ea){ea=ea||i.ALL;return r[da][ea].getElementsUntil(ca);},unsubscribe:function(ca,da,ea){ea=ea||i.ALL;r[da][ea].unsubscribe(ca);}};function ba(ca){switch(ca.payload_source){case n.MercuryPayloadSource.CLIENT_CHANGE_ARCHIVED_STATUS:case n.MercuryPayloadSource.CLIENT_CHANGE_READ_STATUS:case n.MercuryPayloadSource.CLIENT_CHANGE_FOLDER:case n.MercuryPayloadSource.CLIENT_CHANNEL_MESSAGE:case n.MercuryPayloadSource.CLIENT_DELETE_MESSAGES:case n.MercuryPayloadSource.CLIENT_DELETE_THREAD:case n.MercuryPayloadSource.CLIENT_SEND_MESSAGE:case n.MercuryPayloadSource.SERVER_SEND_MESSAGE:case n.MercuryPayloadSource.SERVER_CONFIRM_MESSAGES:case n.MercuryPayloadSource.SERVER_FETCH_THREADLIST_INFO:case n.MercuryPayloadSource.SERVER_THREAD_SYNC:return true;case n.MercuryPayloadSource.SERVER_INITIAL_DATA:return ca.ordered_threadlists;default:return false;}}j.subscribe('update-threadlist',function(ca,da){if(!ba(da))return;var ea=da.ordered_threadlists;if(ea&&ea.length){t(ea);}else{var fa=(da.actions||[]).filter(function(ga){return ga.thread_id;});v(da.threads||[]);u(fa);}l.updatedThreadlist();});e.exports=aa;});
__d("WebMessengerStateConstants",[],function(a,b,c,d,e,f){var g={STATE_CHANGE_EVENT:'state-changed',DETAIL:{COMPOSE_MAIN:'compose-main',COMPOSE_TYPEAHEAD_RESULTS:'compose-typeahead-results',COMPOSE_ALL_PEOPLE_RESULTS:'compose-all-people-results',RECENT_MESSAGES:'recent-messages',SEARCH_CONTEXT:'search-context',SEARCH_SNIPPET:'search-snippet'},MASTER:{RECENT_THREADS:'recent-threads',SEARCH:'search'},MESSAGE_ACTION:{DELETE:'delete',FORWARD:'forward'}};e.exports=g;});
__d("WebMessengerOldToNewPermalink",["WebMessengerPermalinkConstants","WebMessengerStateConstants"],function(a,b,c,d,e,f){var g=b('WebMessengerPermalinkConstants'),h=b('WebMessengerStateConstants');function i(n){if(!j(n))return n;k(n);m(n);l(n);return n;}function j(n){var o=n.getQueryData();if(o.sk)switch(o.sk){case 'inbox':n.setPath(g.BASE_PATH);n.removeQueryData('sk');break;case 'other':n.setPath(g.OTHER_PATH);n.removeQueryData('sk');break;default:return false;}return true;}function k(n){var o=n.getQueryData();switch(o.action){case 'read':if(!o.tid){n.addQueryData({action:h.DETAIL.RECENT_MESSAGES});}else n.removeQueryData('action');break;}}function l(n){var o=n.getQueryData();if(o.tid){n.setPath(g.getURIPathForThreadID(o.tid,n.getPath()));n.removeQueryData('tid');}}function m(n){var o=n.getQueryData();if(!n.getPath().match(g.SEARCH_POSTFIX_PATH)&&o.action!=h.DETAIL.SEARCH_SNIPPET&&!o.mid){var p=o.query;if(o.query){var q=/\bis:(archived|spam)\b(.*)/,r=q.exec(o.query);if(r){switch(r[1]){case 'archived':n.setPath(g.ARCHIVED_PATH);break;case 'spam':n.setPath(g.SPAM_PATH);break;}var s=o.query.substr(0,o.query.length-r[0].length),t=r[2];p=(s.trim()+' '+t.trim()).trim();}}if(o.thread_query){n.setPath(n.getPath()+g.SEARCH_POSTFIX_PATH);n.setQueryData({query:o.thread_query});}else if(p){n.setPath(n.getPath()+g.SEARCH_POSTFIX_PATH);n.addQueryData({query:p});}else n.removeQueryData('query');}}e.exports=i;});
__d("WebMessengerStateStore",["MercuryAssert","PresenceState"],function(a,b,c,d,e,f){var g=b('MercuryAssert'),h=b('PresenceState'),i=null;function j(){var l=h.get();if(l&&l.wml)return l.wml;return {};}h.registerStateStorer(function(l){if(i)l.wml=i;i=null;});var k={getLastSeenThreadID:function(){var l=j();return l.thread_id||null;},getLastSeenFolder:function(){var l=j();return l.folder||null;},setLastSeen:function(l,m){m&&g.isThreadID(m);i={folder:l,thread_id:m||null};h.doSync();}};e.exports=k;});
__d("WebMessengerPermalinks",["goURI","MercuryIDs","MercuryParticipants","MercuryFilters","WebMessengerOldToNewPermalink","WebMessengerPermalinkConstants","MercuryServerRequests","WebMessengerStateConstants","WebMessengerStateStore","MercuryThreads","Token","URI","MercuryConstants","WebMessengerConstants"],function(a,b,c,d,e,f){var g=b('goURI'),h=b('MercuryIDs'),i=b('MercuryParticipants'),j=b('MercuryFilters'),k=b('WebMessengerOldToNewPermalink'),l=b('WebMessengerPermalinkConstants'),m=b('MercuryServerRequests'),n=b('WebMessengerStateConstants'),o=b('WebMessengerStateStore'),p=b('MercuryThreads'),q=b('Token'),r=b('URI'),s=c('MercuryConstants'),t=c('WebMessengerConstants'),u={getDefaultURI:function(){var ga=new r().setSubdomain('www');ga.setPath(l.BASE_PATH);return ga;},goNextURI:function(ga,ha,ia){if(da(ga,ha,ia)){var ja=u.getURI(ga,ha,ia);g(ja);return true;}return false;},getURI:function(ga,ha,ia){var ja=u.getDefaultURI();if(!ga||!ha||!ia)return ja;switch(ia.folder){case s.MessagingTag.OTHER:ja.setPath(l.OTHER_PATH);break;case s.MessagingTag.ACTION_ARCHIVED:ja.setPath(l.ARCHIVED_PATH);break;case s.MessagingTag.SPAM:ja.setPath(l.SPAM_PATH);break;}if(ia.filter&&(ia.filter!=j.ALL))ja.addQueryData({filter:ia.filter});var ka;switch(ga){case n.MASTER.SEARCH:ka=false;ja.setPath(ja.getPath()+l.SEARCH_POSTFIX_PATH);break;}switch(ha){case n.DETAIL.COMPOSE_MAIN:case n.DETAIL.COMPOSE_TYPEAHEAD_RESULTS:case n.DETAIL.COMPOSE_ALL_PEOPLE_RESULTS:ja.setPath(ja.getPath()+l.COMPOSE_POSTFIX_PATH);ka=false;break;case n.DETAIL.RECENT_MESSAGES:ka=!ia.thread_id;break;case n.DETAIL.SEARCH_CONTEXT:ka=false;break;default:ka=true;break;}if(ka)ja.addQueryData({action:ha});if(ia.thread_id){var la=p.getCanonicalUserInThread(ia.thread_id),ma=la&&i.getNow(i.getIDForUser(la));if(ma&&ma.type!==s.MercuryParticipantTypes.EVENT){var na=(ma&&ma.vanity)||la;ja.setPath(l.getURIPathForIDOrVanity(na,ja.getPath()));}else{var oa=m.getServerThreadIDNow(ia.thread_id),pa=oa?oa:ia.thread_id;ja.setPath(l.getURIPathForThreadID(pa,ja.getPath()));}}if(ia.query)ja.addQueryData({query:ia.query});if(ia.message_query)ja.addQueryData({mquery:ia.message_query});if(ia.message_id)ja.addQueryData({mid:ia.message_id});if(ia.reuse_composer)ja.addQueryData({rc:true});return ja;},processURI:function(ga){ga=k(ga);if(!u.isWebMessengerURI(ga))return false;var ha=ea(ga);if(!ha.master_state||!ha.detail_state)return fa(ga);var ia={data:{folder:ba(ga),filter:ca(ga)},redirect:false,master_state:ha.master_state,detail_state:ha.detail_state};if(ga.getQueryData().rc)ia.data.reuse_composer=true;ia=y(ga,ia);switch(ha.detail_state){case n.DETAIL.RECENT_MESSAGES:return aa(ga,ia);case n.DETAIL.COMPOSE_MAIN:return v(ga,ia);case n.DETAIL.SEARCH_SNIPPET:ia=z(ga,ia);return ia;case n.DETAIL.SEARCH_CONTEXT:ia=aa(ga,ia);ia=z(ga,ia);return x(ga,ia);}ia.redirect=true;return ia;},isWebMessengerURI:function(ga){return (/^(\/messages|\/webmessenger)/).test(ga.getPath());}};function v(ga,ha){var ia=ga.getQueryData().to;return w(ia,ha);}function w(ga,ha){if(ga){var ia=i.getNow(i.getIDForUser(ga));if(ia){var ja={uid:ga,text:ia.name,type:t.USER_TYPE};ha.data.new_tokens=[new q(ja)];}}ha.data.start=true;return ha;}function x(ga,ha){var ia=ga.getQueryData().mid;if(ia){ha.data.message_id=ia;}else ha.redirect=true;return ha;}function y(ga,ha){var ia=ga.getQueryData().query;ha.data.query=ia;return ha;}function z(ga,ha){var ia=ga.getQueryData().mquery;ha.data.message_query=ia;return ha;}function aa(ga,ha){var ia=l.getThreadIDFromURI(ga);if(ia){var ja=h.isValid(ia)?ia:m.getClientThreadIDNow(ia);if(ja){ha.data.thread_id=ja;}else ha.redirect=true;}else{var ka=l.getUserIDOrVanity(ga.getPath());if(ka){var la=i.getIDFromVanityOrFBID(ka),ma=la&&p.getCanonicalThreadToParticipant(la,null,s.MercuryAPIArgsSource&&s.MercuryAPIArgsSource.WEBMESSENGER);if(ma){if(ma.timestamp){ha.data.thread_id=ma.thread_id;}else{ha.detail_state=n.DETAIL.COMPOSE_MAIN;ha=w(i.getUserID(la),ha);}}else ha.redirect=true;}}return ha;}function ba(ga,ha){var ia=ga.getPath();if(ia.match('^'+l.ARCHIVED_PATH))return s.MessagingTag.ACTION_ARCHIVED;if(ia.match('^'+l.OTHER_PATH))return s.MessagingTag.OTHER;if(ia.match('^'+l.SPAM_PATH))return s.MessagingTag.SPAM;if(ha!==undefined)return ha;return s.MessagingTag.INBOX;}function ca(ga){return ga.getQueryData().filter||j.ALL;}function da(ga,ha,ia){if(ha===n.DETAIL.SEARCH_CONTEXT)return false;if(ia&&ia.no_uri===true){delete ia.no_uri;return false;}var ja=ha==n.DETAIL.COMPOSE_MAIN||ha==n.DETAIL.COMPOSE_TYPEAHEAD_RESULTS||ha==n.DETAIL.COMPOSE_ALL_PEOPLE_RESULTS;if(ja&&(!ia.start||ia.new_tokens))return false;if(!ga||!ha||!ia)return true;if(ia.bug_reporting_enabled)return false;return !ia.message_action;}function ea(ga){var ha={},ia=ga.getPath(),ja=ga.getQueryData(),ka=ia.match(l.BASE_PATH+'(/[^/]+)?'+l.SEARCH_POSTFIX_PATH+'(/[^/]+)?');ha.master_state=ka&&ja.query?n.MASTER.SEARCH:n.MASTER.RECENT_THREADS;if(ja.action){ha.detail_state=ja.action;return ha;}if(ia.match(l.BASE_PATH+'(/[^/]+)?'+l.COMPOSE_POSTFIX_PATH)){ha.detail_state=n.DETAIL.COMPOSE_MAIN;return ha;}if(ia.match(l.TID_POSTFIX_PARTIAL_PATH)||l.getUserIDOrVanity(ia)){if(ja.mid&&ja.mquery){ha.detail_state=n.DETAIL.SEARCH_CONTEXT;}else ha.detail_state=n.DETAIL.RECENT_MESSAGES;}else if(ja.mquery)ha.detail_state=n.DETAIL.SEARCH_SNIPPET;return ha;}function fa(ga){var ha=ba(ga,null)||o.getLastSeenFolder(),ia=o.getLastSeenThreadID(),ja={redirect:!!ia||!!ha,master_state:n.MASTER.RECENT_THREADS,detail_state:n.DETAIL.RECENT_MESSAGES,data:{folder:ha||s.MessagingTag.INBOX,filter:j.ALL,thread_id:ia}};return ja;}e.exports=u;});
__d("MercuryJewelThreadlistControl",["event-extensions","ArbiterMixin","CSS","DOM","MercuryOrderedThreadlist","Parent","MercuryThreadInformer","MercuryThreadMetadataRenderer","MercuryThreads","WebMessengerPermalinks","WebMessengerStateConstants","copyProperties","tx","MercuryConfig","MercuryConstants","MercuryJewelTemplates"],function(a,b,c,d,e,f){b('event-extensions');var g=b('ArbiterMixin'),h=b('CSS'),i=b('DOM'),j=b('MercuryOrderedThreadlist'),k=b('Parent'),l=b('MercuryThreadInformer'),m=b('MercuryThreadMetadataRenderer'),n=b('MercuryThreads'),o=b('WebMessengerPermalinks'),p=b('WebMessengerStateConstants'),q=b('copyProperties'),r=b('tx'),s=c('MercuryConfig'),t=c('MercuryConstants'),u=c('MercuryJewelTemplates');function v(w){this._rootElement=w;this._contentElement=i.find(this._rootElement,'.jewelContent');this._loadingElement=i.find(this._rootElement,'.jewelLoading');l.subscribe('threadlist-updated',this.render.bind(this));this.render();}q(v,{EVENT_THREADS_LOADED:'threads-loaded',EVENT_THREADS_RENDERED:'threads-rendered'});q(v.prototype,g);q(v.prototype,{render:function(){i.empty(this._contentElement);h.show(this._loadingElement);var w=i.create('div');i.appendContent(this._contentElement,w);j.getThreadlist(t.MercuryThreadlistConstants.RECENT_THREAD_OFFSET,t.MercuryThreadlistConstants.JEWEL_THREAD_COUNT,t.MessagingTag.INBOX,this.renderThreads.bind(this,w),true);},renderThreads:function(w,x){this.inform(v.EVENT_THREADS_LOADED);if(x.length){x.forEach(function(y){var z=u[':fb:mercury:jewel:threadlist-row'].build();n.getThreadMeta(y,function(aa){m.renderCoreThreadlist(aa,z,this.renderSingleThread.bind(this),{show_unread_count:true});}.bind(this));i.appendContent(w,z.getRoot());}.bind(this));}else i.setContent(this._rootElement,this.renderEmptyThreadlist());h.hide(this._loadingElement);this.inform(v.EVENT_THREADS_RENDERED);},renderSingleThread:function(w,x){if(x.unread_count>0)h.addClass(w.getRoot(),'jewelItemNew');if(s.MessagesMercuryIntegrationGK){w.getNode('link').setAttribute('href',o.getURI(p.MASTER.RECENT_THREADS,p.DETAIL.RECENT_MESSAGES,{thread_id:x.thread_id}).toString());}else m.renderTitanLink(x.thread_id,w.getNode('link'));Event.listen(w.getRoot(),'mouseover',function(event){var y=w.getRoot();if(!k.byClass(y,'notifNegativeBase'))h.addClass(y,'selected');});Event.listen(w.getRoot(),'mouseout',function(event){h.removeClass(w.getRoot(),'selected');});},renderEmptyThreadlist:function(){return i.create('li',{className:'empty'},"No messages");}});e.exports=v;});
__d("MercuryJewel",["MercuryChannelHandler","MercuryJewelCountControl","DOM","MercuryJewelThreadlistControl","MercuryServerRequests","userAction"],function(a,b,c,d,e,f){b('MercuryChannelHandler');var g=b('MercuryJewelCountControl'),h=b('DOM'),i=b('MercuryJewelThreadlistControl'),j=b('MercuryServerRequests'),k=b('userAction'),l=false;function m(q,r,s,t){j.handleUpdate(t);var u=new g(r,s),v=h.find(q,'#MercuryJewelThreadList');if(s.getRoot()&&s.isOpen()){n.call(this,v);}else s.subscribe('opened',n.bind(this,v));}e.exports=m;function n(q){this._ua=k('messages').uai('click','jewel');this._listenForLoad=this._listenForRender=true;if(!l){var r=new i(q);r.subscribe(i.EVENT_THREADS_LOADED,o.bind(this));r.subscribe(i.EVENT_THREADS_RENDERED,p.bind(this));l=true;}}function o(){if(this._listenForLoad){this._ua.add_event('loaded');this._listenForLoad=false;}}function p(){if(this._listenForRender){this._ua.add_event('rendered');this._listenForRender=false;}}});
function FriendBrowserCheckboxController(){}copyProperties(FriendBrowserCheckboxController,{instances:{},getInstance:function(a){return this.instances[a];}});copyProperties(FriendBrowserCheckboxController.prototype,{init:function(a,b){FriendBrowserCheckboxController.instances[a]=this;this._id=a;this._form=b;this._contentGrid=DOM.find(b,'.friendBrowserCheckboxContentGrid');this._loadingIndicator=DOM.find(b,'.friendBrowsingCheckboxContentLoadingIndicator');this._checkboxResults=DOM.find(b,'.friendBrowserCheckboxResults');this._contentPager=DOM.find(b,'.friendBrowserCheckboxContentPager');this.numGetNewRequests=0;this.queuedRequests={};},addTypeahead:function(a,b){a.subscribe('select',this.onHubSelect.bind(this,a,b));},onHubSelect:function(a,b,event,c){if(!((event=='select')&&c.selected))return;var d=this.buildNewCheckbox(b,c.selected.text,c.selected.uid),e=DOM.find(this._form,'.checkboxes_'+b);DOM.appendContent(e.firstChild,d);var f=DOM.scry(a.getElement(),'input[type="button"]');if(f&&f[0])f[0].click();this.getNew(true);},buildNewCheckbox:function(a,b,c){var d=a+'_ids_'+c,e=a+'_ids[]',f=DOM.create('input',{id:d,type:'checkbox',value:c,name:e,checked:true});Event.listen(f,'click',bind(this,'getNew',false));var g=DOM.create('td',null,f);CSS.addClass(g,'vTop');CSS.addClass(g,'hLeft');var h=DOM.create('label',null,b),i=DOM.create('td',null,h);CSS.addClass(i,'vMid');CSS.addClass(i,'hLeft');var j=DOM.create('tr');j.appendChild(g);j.appendChild(i);return j;},showMore:function(){var a=DOM.scry(this._contentPager,'.friendBrowserMorePager')[0];if(!a)return false;if(CSS.hasClass(a,'async_saving'))return false;var b=this.numGetNewRequests,c=Form.serialize(this._form);c.show_more=true;var d=new AsyncRequest().setURI('/ajax/growth/friend_browser/checkbox.php').setData(c).setHandler(bind(this,function(e){this.showMoreHandler(e,b);})).setStatusElement(a).send();},showMoreHandler:function(a,b){if(b==this.numGetNewRequests){var c=a.payload;DOM.appendContent(this._contentGrid,c.results);this.updatePagerAndExtraData(c.pager,c.extra_data);}},getNew:function(a){this.numGetNewRequests++;var b=this.numGetNewRequests;CSS.addClass(this._checkboxResults,'friendBrowserCheckboxContentOnload');if(ge('friendBrowserCI'))CSS.addClass($('friendBrowserCI'),'friendBrowserCheckboxContentOnload');CSS.show(this._loadingIndicator);var c=Form.serialize(this._form);c.used_typeahead=a;new AsyncRequest().setURI('/ajax/growth/friend_browser/checkbox.php').setData(c).setHandler(bind(this,function(d){this.getNewHandler(d,b);})).send();},getNewHandler:function(a,b){if(b==this.numGetNewRequests){var c=a.payload;DOM.setContent(this._contentGrid,c.results);CSS.removeClass(this._checkboxResults,'friendBrowserCheckboxContentOnload');if(ge('friendBrowserCI'))CSS.hide($('friendBrowserCI'));CSS.hide(this._loadingIndicator);this.updatePagerAndExtraData(c.pager,c.extra_data);}},updatePagerAndExtraData:function(a,b){DOM.setContent(this._contentPager,a);this.setupOnVisible();DOM.replace(this._form.elements.extra_data,b);},setupOnVisible:function(){var a=DOM.scry(this._contentPager,'.friendBrowserMorePager')[0];if(a&&this._id!='jewel'){this._onVisible&&this._onVisible.remove();this._onVisible=new OnVisible(a,bind(this,'showMore'),false,1000);}}});
__d("ContextualBlind",["event-extensions","Animation","DOM","Rect","Vector","$"],function(a,b,c,d,e,f){b('event-extensions');var g=b('Animation'),h=b('DOM'),i=b('Rect'),j=b('Vector'),k=b('$'),l=[],m=null,n=null,o=false,p=.8,q=500;function r(u,v){v.getPositionVector().setElementPosition(u);v.getDimensionVector().setElementDimensions(u);}function s(){l=[];m&&m.remove();n&&h.remove(n);o=false;}var t={show:function(u,v,w){t.hide();for(var x=0;x<4;x++)l.push(h.create('div',{className:'contextualBlind'}));h.appendContent(document.body,l);if(w!==false){n=h.create('div',{className:'contextualBlindContext'});h.appendContent(document.body,n);}t.updatePosition(u,v);m=Event.listen(window,'resize',t.updatePosition.bind(t,u,v));o=true;},fadeIn:function(u,v,w,x,y){var z=o;t.show(u,v,w);if(z)return;p=x!==undefined?x:p;q=y!==undefined?y:q;for(var aa=0;aa<l.length;aa++){var ba=l[aa];new g(ba).duration(q).from('opacity',0).to('opacity',p).go();}},hide:function(){l.forEach(h.remove);s();},fadeOut:function(){for(var u=0;u<l.length;u++){var v=l[u];new g(v).duration(q).from('opacity',p).to('opacity',0).ondone(h.remove.curry(v)).go();}s();},updatePosition:function(u,v){var w=j.getDocumentDimensions().y,x=i.getElementBounds(k(u));if(v)x=new i(x.t-v,x.r+v,x.b+v,x.l-v,x.domain);var y=document,z=(y&&y.documentElement&&y.documentElement.clientWidth)||(y&&y.body&&y.body.clientWidth)||0;r(l[0],new i(0,z,x.t,0,'document'));r(l[1],new i(x.t,z,x.b,x.r,'document'));r(l[2],new i(x.b,z,w,0,'document'));r(l[3],new i(x.t,x.l,x.b,0,'document'));if(n)r(n,x);}};e.exports=a.ContextualBlind||t;});
__d("UserNoOp",["copyProperties"],function(a,b,c,d,e,f){var g=b('copyProperties'),h=function(){},i=function(){return this;};g(h.prototype,{add_event:i,add_data:i,uai:i,uai_fallback:i});e.exports=h;});
__d("legacy:UserAction",["UserNoOp","userAction","reportData","clickRefAction"],function(a,b,c,d){a.UserNoOp=b('UserNoOp');a.user_action=b('userAction');a.report_data=b('reportData');a.click_ref_action=b('clickRefAction');},3);
__d("legacy:Poller",["Poller"],function(a,b,c,d){a.Poller=b('Poller');},3);
__d("QuicklingAugmenter",["URI"],function(a,b,c,d,e,f){var g=b('URI'),h=[],i={addHandler:function(j){h.push(j);},augmentURI:function(j){var k=[],l=g(j);h.forEach(function(m){var n=m(l);if(!n)return;k.push(m);l=l.addQueryData(n);});h=k;return l;}};e.exports=i;});
__d("Quickling",["AjaxPipeRequest","Arbiter","Class","DocumentTitle","DOM","ErrorUtils","HTML","OnloadHooks","PageTransitions","QuicklingAugmenter","Run","URI","UserAgent","copyProperties","goOrReplace","isEmpty","QuicklingConfig"],function(a,b,c,d,e,f){var g=b('AjaxPipeRequest'),h=b('Arbiter'),i=b('Class'),j=b('DocumentTitle'),k=b('DOM'),l=b('ErrorUtils'),m=b('HTML'),n=b('OnloadHooks'),o=b('PageTransitions'),p=b('QuicklingAugmenter'),q=b('Run'),r=b('URI'),s=b('UserAgent'),t=b('copyProperties'),u=b('goOrReplace'),v=b('isEmpty'),w=c('QuicklingConfig'),x=w.version,y=w.sessionLength,z=new RegExp(w.inactivePageRegex),aa=0,ba,ca='',da={isActive:function(){return true;},isPageActive:function(ka){if(ka=='#')return false;ka=new r(ka);if(ka.getDomain()&&ka.getDomain()!=r().getDomain())return false;if(ka.getPath()=='/l.php'){var la=ka.getQueryData().u;if(la){la=r(unescape(la)).getDomain();if(la&&la!=r().getDomain())return false;}}var ma=ka.getPath(),na=ka.getQueryData();if(!v(na))ma+='?'+r.implodeQuery(na);return !z.test(ma);}};function ea(ka){ka=ka||'Facebook';j.set(ka);if(s.ie()){ca=ka;if(!ba)ba=window.setInterval(function(){var la=ca,ma=j.get();if(la!=ma)j.set(la);},5000,false);}}function fa(ka){var la=document.getElementsByTagName('link');for(var ma=0;ma<la.length;++ma){if(la[ma].rel!='alternate')continue;k.remove(la[ma]);}if(ka.length){var na=k.find(document,'head');na&&k.appendContent(na,m(ka[0]));}}function ga(ka){var la={version:x};this.parent.construct(this,ka,{quickling:la});}i.extend(ga,g);t(ga.prototype,{_preBootloadFirstResponse:function(ka){return true;},_fireDomContentCallback:function(){this._request.cavalry&&this._request.cavalry.setTimeStamp('t_domcontent');o.transitionComplete();this._onPageDisplayed&&this._onPageDisplayed(this.pipe);this.parent._fireDomContentCallback();},_fireOnloadCallback:function(){if(this._request.cavalry){this._request.cavalry.setTimeStamp('t_hooks');this._request.cavalry.setTimeStamp('t_layout');this._request.cavalry.setTimeStamp('t_onload');}this.parent._fireOnloadCallback();},isPageActive:function(ka){return da.isPageActive(ka);},_versionCheck:function(ka){if(ka.version==x)return true;var la=['quickling','ajaxpipe','ajaxpipe_token'];u(window.location,r(ka.uri).removeQueryData(la),true);return false;},_processFirstResponse:function(ka){var la=ka.getPayload();ea(la.title);fa(la.syndication||[]);window.scrollTo(0,0);var ma=la.body_class||'';document.body.className=ma;},getSanitizedParameters:function(){return ['quickling'];}});function ha(){aa++;return aa>=y;}function ia(ka){g.setCurrentRequest(null);if(ha())return false;ka=p.augmentURI(ka);if(!da.isPageActive(ka))return false;window.ExitTime=Date.now();q.__removeHook('onafterloadhooks');q.__removeHook('onloadhooks');n.runHooks('onleavehooks');h.inform('onload/exit',true);new ga(ka).setCanvasId('content').send();return true;}function ja(ka){var la=window[ka];function ma(na,oa,pa){if(typeof na!=='function')na=eval.bind(null,na);var qa=la(l.guard(na),oa);if(oa>0)if(pa!==false)q.onLeave(function(){clearInterval(qa);});return qa;}window[ka]=ma;}ja('setInterval');ja('setTimeout');o.registerHandler(ia,1);e.exports=a.Quickling=da;});
__d("StringTransformations",[],function(a,b,c,d,e,f){e.exports={unicodeEscape:function(g){return g.replace(/[^A-Za-z0-9\-\.\:\_\$\/\+\=]/g,function(h){var i=h.charCodeAt().toString(16);return '\\u'+('0000'+i.toUpperCase()).slice(-4);});},unicodeUnescape:function(g){return g.replace(/(\\u[0-9A-Fa-f]{4})/g,function(h){return String.fromCharCode(parseInt(h.slice(2),16));});}};});
__d("legacy:notifications-counter",["NotificationCounter"],function(a,b,c,d){a.NotificationCounter=b('NotificationCounter');},3);
__d("SearchTypeaheadCore",["event-extensions","function-extensions","Arbiter","Class","DOM","Input","Parent","TypeaheadCore","copyProperties"],function(a,b,c,d,e,f){b('event-extensions');b('function-extensions');var g=b('Arbiter'),h=b('Class'),i=b('DOM'),j=b('Input'),k=b('Parent'),l=b('TypeaheadCore'),m=b('copyProperties');function n(o){this.parent.construct(this,o);}h.extend(n,l);m(n.prototype,{init:function(o,p,q){this.parent.init(o,p,q);var r=k.byTag(q,'form'),s=this.reset.bind(this);g.subscribe('pre_page_transition',function(event,u){var v=/^\/search/,w=v.test(u.from.path),x=v.test(u.to.path);if(w&&!x)s.defer();});if(r){var t=i.find(r,'input.search_sid_input');Event.listen(r,'submit',function(){if(this.data&&this.data.queryData)t.value=this.data.queryData.sid;s.defer();}.bind(this),Event.Priority.URGENT);}},select:function(){this.reset();this.element.focus();(function(){this.element.blur();}).bind(this).defer();},handleTab:function(event){var o=this.view.getQuerySuggestion(this.value);if(o){j.setValue(this.element,o);this.checkValue();event.kill();}else this.parent.handleTab(event);}});e.exports=n;});
__d("legacy:Typeahead",["Typeahead"],function(a,b,c,d){a.Typeahead=b('Typeahead');},3);
__d("SearchTypeaheadRenderer",["DOM","Env","MusicButtonManager","TypeaheadUtil"],function(a,b,c,d,e,f){var g=b('DOM'),h=b('Env'),i=b('MusicButtonManager'),j=b('TypeaheadUtil');function k(l,m){var n=[];if(l.photo){n.push(g.create('img',{className:'photo',alt:'',src:l.photo}));if(l.song){n.push(g.create('span',{className:'playButton'}));n.push(g.create('span',{className:'playLoader'}));}}if(l.text){var o=l.alias,p=this.value,q=l.text,r=[q];if(o&&j.isQueryMatch(p,o)&&!j.isQueryMatch(p,q))r.push(g.create('span',{className:'alias'},[' \xB7 '+o]));n.push(g.create('span',{className:'text'},r));}if(l.category){var s=[l.category];if(l.is_external)s.push(g.create('span',{className:'arrow'}));var t=l.message?'preCategory':'category';n.push(g.create('span',{className:t},s));}if(l.message)n.push(g.create('span',{className:'category'},[l.message]));var u=l.subtextOverride||l.subtext;if(u)n.push(g.create('span',{className:'subtext'},[u]));var v=l.classNames||l.type||'',w=l.is_external?'_blank':'',x=!l.song&&l.path||'';if(x){if(!(/^https?\:\/\//).test(x))x=h.www_base+x.substr(1);x+=(x.indexOf('?')>0?'&':'?')+'ref=ts';}var y=g.create('a',{href:x,rel:'ignore',target:w},n);if(l.song){y.id='mb_'+(Math.random()*1e+06|0);i.addButton.curry(l.song.provider,y.id,l.song.url,l.song.context,l.song.media_type).defer();y.onclick=this.ignoreClick;}var z=g.create('li',{className:v},[y]);if(l.text)z.setAttribute('aria-label',l.text);return z;}k.className='search';e.exports=k;});
__d("legacy:SearchTypeaheadRenderer",["SearchTypeaheadRenderer"],function(a,b,c,d){if(!a.TypeaheadRenderers)a.TypeaheadRenderers={};a.TypeaheadRenderers.search=b('SearchTypeaheadRenderer');},3);
__d("TypeaheadRegulateMemorializedUsers",["copyProperties","TypeaheadUtil"],function(a,b,c,d,e,f){var g=b('copyProperties'),h=b('TypeaheadUtil');function i(j){this._typeahead=j;}g(i.prototype,{_filterRegistry:null,_filter:function(j,k){if(j.type!=='user'||!j.memorialized)return true;var l=h.parse(j.text).tokens;if(l.length===1&&h.isExactMatch(k,j.text))return true;var m=this._typeahead.getData().getTextToIndex(j),n=h.parse(k).tokens;return (n.length>1&&h.isQueryMatch(k,m));},enable:function(){this._filterRegistry=this._typeahead.getData().addFilter(this._filter.bind(this));},disable:function(){this._filterRegistry.remove();this._filterRegistry=null;}});e.exports=i;});
__d("legacy:RegulateMemorializedUsersTypeaheadBehavior",["TypeaheadRegulateMemorializedUsers"],function(a,b,c,d){var e=b('TypeaheadRegulateMemorializedUsers');if(!a.TypeaheadBehaviors)a.TypeaheadBehaviors={};a.TypeaheadBehaviors.regulateMemorializedUsers=function(f){f.enableBehavior(e);};},3);
__d("WebStorageMonster",["event-extensions","AsyncRequest","UserActivity","StringTransformations","setTimeoutAcrossTransitions"],function(a,b,c,d,e,f){b('event-extensions');var g=b('AsyncRequest'),h=b('UserActivity'),i=b('StringTransformations'),j=b('setTimeoutAcrossTransitions'),k=300000,l=false;function m(r){var s={};for(var t in r){var u=r.getItem(t),v=i.unicodeEscape(t);if(typeof u==='string')s[v]=u.length;}return s;}function n(r){if(a.localStorage&&r.keys)q._getLocalStorageKeys().forEach(function(s){if(r.keys.contains(s))a.localStorage.removeItem(s);});}function o(r){if(a.localStorage)q._getLocalStorageKeys().forEach(function(s){if(!r.some(function(t){return new RegExp(t).test(s);}))a.localStorage.removeItem(s);});if(a.sessionStorage)a.sessionStorage.clear();}function p(r){if(h.isActive(k)){j(p.curry(r),k);}else q.cleanNow(r);}var q={registerLogoutForm:function(r,s){Event.listen(r,'submit',function(t){q.cleanOnLogout(s);});},schedule:function(r){if(l)return;l=true;p(r);},cleanNow:function(r){var s=Date.now(),t={},u=false;['localStorage','sessionStorage'].forEach(function(w){if(a[w]){t[w]=m(a[w]);u=true;}});var v=Date.now();t.logtime=v-s;if(u)new g('/ajax/webstorage/process_keys.php').setData(t).setHandler(function(w){if(!r){var x=w.getPayload();if(x.keys)x.keys=x.keys.map(i.unicodeUnescape);n(x);}}.bind(this)).send();},cleanOnLogout:function(r){if(r)o(r);if(a.sessionStorage)a.sessionStorage.clear();},_getLocalStorageKeys:Object.keys.curry(a.localStorage)};e.exports=q;});