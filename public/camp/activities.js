export const ACTIVITIES=[['car','🚙','車をとめる','お気に入りの一台'],['tent','⛺','テント・宿泊場所','基地をえらぼう'],['tarp','⛱️','タープをはる','木かげのリビング'],['fire','🔥','焚き火をする','ぱちぱち、ほっ。'],['meal','🍳','ごはんをたべる','朝・昼なども追加できる'],['sleep','🌙','ねる','星空におやすみ'],['play','⚽','遊ぶ','みんなではずもう'],['swim','🏊','泳ぐ','水あそびを楽しもう'],['fish','🎣','釣り','のんびり待ってみよう'],['sing','🎵','歌う','声をあわせて'],['walk','🥾','歩く','ぐるっとおさんぽ'],['bath','♨️','お風呂','ぽかぽか、ひとやすみ']];
export const ACTION_KEYS=['tent','fire','meal','sleep','car','tarp','play','swim','fish','sing','walk','bath'];
export const EXPERIENCE_KEYS=['play','swim','fish','sing','walk','bath'];
export const activityPose=id=>({play:'hop',swim:'swim',fish:'sit',sing:'wave',walk:'walk',bath:'sit'})[id]||null;
export const activityLocation=id=>({play:{x:4,z:1},swim:{x:6,z:-3},fish:{x:6,z:-3},sing:{x:0,z:4},walk:{x:-6,z:4},bath:{x:-7,z:-3}})[id];
