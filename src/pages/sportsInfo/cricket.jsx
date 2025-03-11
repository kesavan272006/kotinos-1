import { Button } from '@mui/material';
import { useRef } from 'react'
import { useState } from 'react';
import fieldingimg from '../../assets/cricket_fielding.png'
import Footer from '../../components/footer';
import { LucideArrowBigDown, LucideArrowBigUp } from 'lucide-react';
import { FaRobot } from 'react-icons/fa';
const Cricket = () => {
  const sectionOneRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);
  const sectionFourRef = useRef(null);
  const sectionFiveRef = useRef(null);
  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
        <nav style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly', backgroundColor:'white', marginBottom:'20px'}}>
            <Button onClick={() => scrollToSection(sectionOneRef)}>Batting</Button>
            <Button onClick={() => scrollToSection(sectionTwoRef)}>Bowling</Button>
            <Button onClick={() => scrollToSection(sectionThreeRef)}>Fielding</Button>
            <Button onClick={() => scrollToSection(sectionFourRef)}>Injuries</Button>
        </nav>
        <h1 ref={sectionOneRef} style={{fontSize:'50px', fontWeight:'bolder'}}>Batting</h1>
        <div style={{borderBottom: '2px solid black' , height:'20px'}}>
        </div>
        <div style={{padding:'2px, 1px'}}>
            <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'20px', marginRight:'5px', textAlign:'left'}}>
                In <span style={{fontWeight:'bolder'}}>Cricket</span>, batting is the act or skill of hitting the ball with a bat to score runs and prevent the loss of one's wicket. Any player who is currently batting is, since September 2021, officially referred to as a batter regardless of whether batting is their particular area of expertise. Historically, batsman and batswoman were used, and these terms remain in widespread use. Batters have to adapt to various conditions when playing on different cricket pitches, especially in different countries; therefore, as well as having outstanding physical batting skills, top-level batters will have quick reflexes, excellent decision-making skills, and be good strategists.
                <br />
                <br />
                During an innings two members of the batting side are on the pitch at any time: the one facing the current delivery from the bowler is called the striker, while the other is the non-striker. When a batter is out, they are replaced by a teammate. This continues until the end of the innings, which in most cases is when 10 of the team members are out, whereupon the other team gets a turn to bat.
                <br />
                <br />
                Batting tactics and strategy vary depending on the type of match being played as well as the current state of play. The main concerns for the batters are not to lose their wicket and to score as many runs as quickly as possible. These objectives generally conflict—to score quickly, risky shots must be played, increasing the chance that the batter will be dismissed, while the batter's safest choice with a careful wicket-guarding stroke may be not to attempt any runs at all. Depending on the situation, batters may abandon attempts at run-scoring in an effort to preserve their wicket, or may attempt to score runs as quickly as possible with scant concern for the possibility of being dismissed. Unlike various other bat-and-ball sports, cricket batters may hit the ball in any direction to score runs, and can use creative shots to do so. <br />
                <br />
                As with all other cricket statistics, batting statistics and records are given much attention and provide a measure of a player's effectiveness. The main statistic for batting is a player's batting average. This is calculated by dividing the number of runs they have scored by the number of times they have been dismissed (not by the number of innings they have played). <br />
            </p>
            <br /><br />
            <div>
                <h1 style={{fontSize:'40px', fontWeight:'bolder',marginLeft:'10px'}}>Cricket Shots</h1>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Vertical-bat strokes</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    Vertical-bat or straight-bat shots can be played off either the front foot or the back foot depending upon the anticipated height of the ball at the moment it reaches the batter. The characteristic position of the bat is a vertical alignment at the point of contact. Vertical-bat shots are typically played with the batter's head directly above the point of contact so he is able to accurately judge the line of the ball. At this point, the bat can either be stationary and facing straight back down the wicket – known as a block or defensive shot; angled to one side – known as a glance or deflection; or travelling forwards towards the bowler – known as a drive.
                    </p>
                </div>
                <br />
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Defensive shot</h1>
                    <br />
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                        A <span style={{fontWeight:'bold'}}>block</span> stroke is usually a purely defensive stroke designed to stop the ball from hitting the wicket or the batter's body. This shot has no strength behind it and is usually played with a light or "soft" grip (commentators often refer to "soft hands") and merely stops the ball moving towards the wicket. A block played on the front foot is known as a forward defensive, while that played on the back foot is known as a backward defensive. These strokes may be used to score runs, by manipulating the block to move the ball into vacant portions of the infield, in which case a block becomes a "push". Pushing the ball is one of the more common ways batters manipulate the strike.
                        <br />
                        Leaving and blocking are employed much more often in first-class cricket (including Test matches), as there is no requirement to score runs as quickly as possible, thus allowing the batter to choose which deliveries to play.
                    </p>
                    <br /><br />
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>leg glance</span> is a delicate straight-batted shot played at a ball aimed slightly on the leg side, using the bat to flick the ball as it passes the batter, and requiring some wrist work as well, deflecting towards the square leg or fine leg area. The stroke involves deflecting the bat-face towards the leg side at the last moment, head and body moving inside the line of the ball. This shot is played "off the toes, shins or hip". It is played off the front foot if the ball is pitched up at the toes or shin of the batter, or off the back foot if the ball bounces at waist/hip height to the batter. Although the opposite term off glance is not employed within cricket, the concept of angling the bat face towards the offside to deflect the ball away from the wicket for the purpose of scoring runs through the off side is a commonly used technique. This would commonly be described instead as "running (or steering) the ball down to the third man".
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Straight Drive</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>drive</span> is a straight-batted shot, played by swinging the bat in a vertical arc through the line of the ball, hitting the ball in front of the batter along the ground. It is one of the most common shots in a batter's armory and often the first shot taught to junior cricketers. Depending on the direction the ball travels, a drive can be a cover drive (struck towards the cover fielding position), an off drive (towards mid-off), straight drive (straight past the bowler), on drive (between stumps and mid-on) or square drive (towards point). A drive can also be played towards midwicket, although the phrase "midwicket drive" is not in common usage. Drives can be played both off the front and the back foot, but back-foot drives are harder to force through the line of the ball. Although most drives are deliberately struck along the ground to reduce the risk of being dismissed caught, a batter may decide to play a lofted drive to hit the ball over the infielders and potentially even over the boundary for six.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Flick</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>Flick</span> shot is a straight-batted shot played on the leg side by flicking a full-length delivery using the wrists. It is often also called the clip off the legs. The shot is played with the bat coming through straight as for the on drive, but the bat face is angled towards the leg side. It can be played both off the front foot or the back foot, either off the toes or from the hips. The shot is played between the mid-on and square leg region. Typically played along the ground, the flick can also be played by lofting the ball over the infield.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Cut</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>cut</span> is a cross-batted shot played at a short-pitched ball, placing it wide on the off side. The batter makes contact with the ball as it draws alongside or passes him and therefore requires virtually no effort on his part as he uses the bowler's pace to divert the ball. A square cut is a shot hit into the off side at near to 90 degrees from the wicket (towards point). A late cut is played as or after the ball passes the batter's body and is hit towards the third man position. The cut shot is typically played off the back foot but is also sometimes played off the front foot against slower bowling. The cut should be played with the face of the bat rolling over the ball to face the ground thus pushing the ball downwards. A mistimed cut with an open-faced bat (with the face of the bat facing the bowler) will generally lead to the ball rising in the air, giving a chance for the batter to be caught.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Pull and Hook</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>pull</span> is a cross-batted shot played to a ball bouncing around waist height by swinging the bat in a horizontal arc in front of the body, pulling it around to the leg side towards mid-wicket or square leg. The term hook shot is used when the shot is played against a ball bouncing at or above chest high to the batter, the batter thus "hooking" the ball around behind square leg, either along the ground or in the air. Pull and hook shots can be played off the front or back foot, with the back foot being more typical.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Sweep</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>sweep</span> is a cross-batted front foot shot played to a low bouncing ball, usually from a slow bowler (However, players like Mal Loye also play the sweep against fast bowlers), by kneeling on one knee, bringing the head down in line with the ball and swinging the bat around in a horizontal arc near the pitch as the ball arrives, sweeping it around to the leg side, typically towards square leg or fine leg. A paddle sweep shot is a sweep shot in which the ball is deflected towards fine leg with a stationary or near-stationary bat extended horizontally towards the bowler, whereas the hard sweep shot is played towards square leg with the bat swung firmly in a horizontal arc. Typically the sweep shot will be played to a legside delivery, but it is also possible for a batter to sweep the ball to the leg side from outside off stump. Attempting to sweep a full straight delivery on the stumps is generally not recommended because of the risk of lbw.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Reverse Sweep</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>reverse sweep</span> is a cross-batted sweep shot played in the opposite direction to the standard sweep, thus instead of sweeping the ball to the leg side, it is swept to the off side, towards a backward point or third man. The batter may also swap his hands on the bat handle to make the stroke easier to execute. The batter may also bring his back foot to the front, therefore, turning the shot into a switch-hit and making it more like a traditional sweep. The advantage of a reverse sweep is that it effectively reverses the fielding positions and thus is very difficult to set a field to. It is also a risky shot for the batter as it increases the chance of lbw and also is quite easy to top edge to a fielder.
                    <br />
                    It was first regularly played in the 1970s by the Pakistani batter Mushtaq Mohammad, though Mushtaq's brother Hanif Mohammad is sometimes credited as the inventor. Cricket coach Bob Woolmer has been credited with popularising the stroke. The most famous example of a reverse sweep backfiring was in the case of Mike Gatting of England against Allan Border of Australia in the 1987 Cricket World Cup Final. With England on course for victory, Gatting attempted a reverse sweep off the first delivery bowled by Border, top-edged the ball and was caught by wicketkeeper Greg Dyer. England subsequently lost momentum and eventually lost the match.
                    <br />
                    Because of the unorthodox nature of hand and body position, it is often difficult to get a lot of power behind a reverse sweep; in many situations, the intention is to glance or cut the ball to the back leg area. However, on rare occasions, players have been able to execute reverse sweeps for a six. Kevin Pietersen, who pioneered switch-hitting, is adept at this, but one could argue[original research?] that the resulting shot is basically a sweep rather than a reverse sweep. A more classic example of such a shot would be Yusuf Pathan's six off Robin Peterson. South Africa's AB de Villiers is well known for his ability to hit sixes with the reverse sweep at ease and Glenn Maxwell also often plays the reverse sweep.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Slog and Slog sweep</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>slog</span> is a powerful pull shot played over mid-wicket, usually, hit in the air in an attempt to score a six. A shot would be referred to as a slog when it is typically played at a delivery that would not ordinarily be pulled. A slog can also be described as hitting the ball to "cow corner". This phrase is designed to imply that the batter is unsophisticated in their stroke play and technique by suggesting they would be more at home playing on more rudimentary cricket fields in which there may be cows grazing along the boundary edge. The slog can be an effective shot because all the batter's power and body weight can be put into swinging the bat at the ball.
                    <br />
                    A <span style={{fontWeight:'bold'}}>slog sweep</span> is a slog played from the kneeling position used to sweep. Slog sweeps are usually directed over square-leg rather than to mid-wicket. It is almost exclusively used against reasonably full-pitched balls from slow bowlers, as only then does the batter have time to sight the length and adopt the kneeling position required for the slog sweep. The front leg of the shot is usually placed wider outside leg stump to allow for a full swing of the bat.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Switch hit</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A <span style={{fontWeight:'bold'}}>switch hit</span> is a shot where a batter changes their handedness and posture to adopt a stance the mirror image of their traditional handedness while the bowler is running in to bowl. As a fielding team cannot manoeuvre fielders while the bowler is in their run-up, the fielding side is effectively wrong-footed with the fielders out of position. The shot was pioneered by Kevin Pietersen, first performed off the bowling of Muttiah Muralitharan in England's 2006 home series against Sri Lanka. It was subsequently used in the New Zealand series in England in 2008 when Pietersen performed the shot twice in the same over against Scott Styris on his way to making an unbeaten century. David Warner, the Australian opener, is also a frequent user of the switch hit and used it to great effect against the Indian off-spinner Ravichandran Ashwin in the first Twenty20 of the Indian cricket team's tour to Australia 2012. Glenn Maxwell and Ben Stokes also play the switch hit.
                    <br />
                    The legality of the switch hit was questioned when first introduced but cleared by the International Cricket Council as legal. The shot is risky because a batter is less proficient in the other handedness and is more likely to make a mistake in the execution of the shot.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Helicopter shot</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    The <span style={{fontWeight:'bold'}}>helicopter shot</span> is the act of hitting the ball by means of a wristy flick, using the bottom-hand as the dominant force. The shot gets its name from the flourish completing the stroke, with the bat being circled overhead. It has been considered an unconventional and innovative stroke which, when hit executed effectively, can be used to score boundaries, even against good yorkers or fuller-length deliveries, which have traditionally been used by faster bowlers towards the end of limited-overs matches because it is difficult to hit such balls to the boundary. The shot got its fame through MS Dhoni, who played it on a regular basis as a way to score boundaries against full and yorker length deliveries.
                    </p>
                </div>
            </div>
            <div ref={sectionTwoRef} style={{padding:'2px, 1px'}}>
                <h1 style={{fontSize:'50px', fontWeight:'bolder'}}>Bowling</h1>
                <div style={{borderBottom: '2px solid black' , height:'20px'}}>

                </div>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'20px', marginRight:'5px', textAlign:'left'}}>
                Bowling, in cricket, is the action of propelling the ball toward the wicket defended by a batter. A player skilled at bowling is called a bowler; a bowler who is also a competent batter is known as an all-rounder. Bowling the ball is distinguished from throwing the ball by a strictly specified biomechanical definition, which restricts the angle of extension of the elbow. A single act of bowling the ball towards the batter is called a ball or a delivery. Bowlers bowl deliveries in sets of six, called an over. Once a bowler has bowled an over, a teammate will bowl an over from the other end of the pitch. The Laws of Cricket govern how a ball must be bowled. If a ball is bowled illegally, an umpire will rule it a no-ball. If a ball is bowled too wide of the striker for the batter to be able to play at it with a proper cricket shot, the bowler's end umpire will rule it a wide.
                <br />
                There are different types of bowlers, from fast bowlers, whose primary weapon is pace, through swing and seam bowlers who try to make the ball deviate in its course through the air or when it bounces, to slow bowlers, who will attempt to deceive the batter with a variety of flight and spin. A spin bowler usually delivers the ball quite slowly and puts spin on the ball, causing it to turn at an angle while bouncing off the pitch.
                <br />
                A team can be said to have elected to "have a bowl" when it wins the coin toss and chooses to field.
                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Bowling action</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                Bowling the ball is distinguished from simply throwing the ball by a strictly specified biomechanical definition.
                <br />
                Originally, this definition said that the elbow joint must not straighten out during the bowling action. Bowlers generally hold their elbows fully extended and rotate the arm vertically about the shoulder joint to impart velocity to the ball, releasing it near the top of the arc. Flexion at the elbow is not allowed, but any extension of the elbow was deemed to be a throw and would be liable to be called a no-ball. This was thought to be possible only if the bowler's elbow was originally held in a slightly flexed position.
                <br />    
                In 2005, this definition was deemed to be physically impossible by a scientific investigative commission. Biomechanical studies that showed that almost all bowlers extend their elbows somewhat throughout the bowling action, because the stress of swinging the arm around hyperextends the elbow joint. A guideline was introduced to allow extensions or hyperextensions of angles up to 15 degrees before deeming the ball illegally thrown.
                <br /> 
                Bowling actions are typically divided into side on and front on actions. In the side on action, the back foot lands parallel to the bowling crease and the bowler aims at the wicket by looking over his front shoulder. In the front on action, the back foot lands pointing down the pitch and the bowler aims at the wicket by looking inside the line of his front arm. Many bowlers operate with a mid-way action with the back foot landing at roughly 45 degrees and the upper body aligned somewhere between side on and front on. This differs from a mixed action, which mixes distinct elements of both side on and front on actions, and is generally discouraged amongst young bowlers as it can lead to problems in later life due to the twisting of the back inherent in the action.
                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Line and length</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                The fundamental skill of bowling on a good length incorporates the ability to pitch the ball such a distance from the batter that he is unable to move forward and drive the ball on the half volley, and is also unable to step back and play the ball on the back foot. This removes many of the batter's attacking options, and also increases the probability of misjudging a delivery and losing the wicket. A good length delivery is one in which the ball has had sufficient time to move far enough off the pitch to beat the bat but the batter has not had time to react to the movement and adjust the shot. The faster the bowler and the greater the movement he is able to generate, the larger the area of the pitch that can be designated an effective "good" length.
                <br />
                Other areas of the pitch may also often be used as a variation to a good length delivery. Primarily these are the yorker, in which the ball is bowled directly at the batter's feet as a surprise delivery intended to dismiss the batter bowled, and the bouncer in which the ball is bowled on such a short length that it rises towards the batter's throat or head as a means of physical intimidation. But the height of an attempted yorker or full toss must not be higher than the batter's waist, or else it will be called a no-ball beamer, which could have bowlers banned from the match.
                <br />
                The line a bowler chooses to bowl will depend on several factors: the movement he is generating on the ball, the shots the batter is able to play, and the field the captain has set. The two most common tactics are to either bowl directly at the stumps, or to bowl 3 inches to 6 inches outside the line of off stump. Bowling at the stumps is an attacking tactic with the intention of dismissing the batter bowled or lbw. It can also be used as a defensive tactic, as the batter will feel less able to play risky shots knowing that he will be dismissed should he miss the ball. Bowling outside off stump is known as the corridor of uncertainty. When done well, this line may confuse the batter into whether to defend the ball or leave it, and may tempt him to play away from his body with his head not in line with the ball. The main aim of this tactic is to dismiss the batter caught by the wicketkeeper or in the slips. Other bowling variations, such as bowling wide of off stump or bowling at leg stump are generally seen as negative and defensive tactics.
                <br />
                <h1>Some different types of bowling tactic:</h1>
                <ul>
                    <li>1. Bodyline</li>
                    <li>2. Leg theory</li>
                    <li>3. Off theory</li>
                </ul>
                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Pace and movement</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                Other than the ability to land the ball on a strategically optimum line and length, the main weapons of the bowler are his ability to move the ball sideways as it approaches the batter and his ability to deliver the ball at a high velocity.
                <br />
                The velocities of cricket bowlers vary between 40 and 100 mph (64 and 161 km/h). In professional cricket, a bowler in the 40–60 mph range would be said to be a slow bowler, in the 60–80 mph range a medium pace bowler, and a bowler 80 mph+ a fast bowler. In the amateur game, these distinctions would be approximately 10 mph slower. Many professional fast bowlers are able to reach speeds of over 85 mph, with a handful of bowlers in the world able to bowl at 95 mph+. The ability to react to a cricket ball travelling at 85 mph is a skill that only professional and high level amateur cricketers possess. The pace of a bowler not only challenges the reaction speed of the batter, but also his physical courage. Fast bowlers are able to exploit this by bowling bouncers, either regularly or as an occasional surprise delivery.
                <br />
                Bowlers are also able to get the ball to move sideways by using either spin or swing. Adding a spin to a cricket ball will make it deviate due to the Magnus effect in its flight (like a slider in baseball), and then produce sideways movement off the ground. Swing is obtained by using air pressure differences caused by angling the seam of the cricket ball to produce a lateral movement in the air. Fast bowlers will generally only use swing to obtain movement, but medium pace and slow bowlers will often use a combination of the two. The intention is that in creating movement in the delivery, the batter will misjudge the line of the ball as it arrives, causing him to miss it entirely, in which case he may be dismissed bowled or lbw, or miss-hit it, in which case he may be out caught.
                <br />
                To avoid becoming predictable, a bowler will typically bowl a variety of different deliveries with different combinations of pace and movement. A tactically astute bowler may be able to spot a potential weakness in a batter that a particular delivery may be able to exploit. Bowlers will often also bowl deliveries in preplanned sets, with the intention of dismissing the batter with the final delivery in the set. This is known as "setting a trap" for the batter.[19] batters and bowlers will often also engage in a game of "cat and mouse", in which the bowler varies his tactics to try and trap and dismiss the batter, but the batter also keeps adjusting his tactics in response.                </p>
            </div>
            <div ref={sectionThreeRef} style={{padding:'2px, 1px'}}>
                <h1 style={{fontSize:'50px', fontWeight:'bolder'}}>Fielding</h1>
                <div style={{borderBottom: '2px solid black' , height:'20px'}}>

                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img src={fieldingimg} alt="Fielding Positions" style={{alignContent:'center', height:'400px', width:'400px', borderRadius:'50%'}}/>
                </div>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                <span style={{fontWeight:'bold'}}>Fielding</span> in the sport of cricket is the action of fielders in collecting the ball after it is struck by the striking batter, to limit the number of runs that the striker scores and/or to get a batter out by either catching a hit ball before it bounces, or by running out either batter before they can complete their current run. There are a number of recognised fielding positions and they can be categorised into the offside and leg side of the field. Fielding also involves trying to prevent the ball from making a boundary where four "runs" are awarded for reaching the perimeter and six for crossing it without touching the grass.
                <br />
                A fielder may field the ball with any part of their body. However, if, while the ball is in play, he/she wilfully fields it otherwise (e.g. by using their hat) the ball becomes dead and five penalty runs are awarded to the batting side, unless the ball previously struck a batter not attempting to hit or avoid the ball. Most of the rules covering fielders are set out in Law 28 of the Laws of cricket. Fake fielding is the action when a fielder makes bodily movements to feign fielding to fool batters into making mistakes and is a punishable offence under the ICC rules.                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Fielding position names and locations</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                There are 11 players in a team: one is the bowler and another is the wicket-keeper, so only nine other fielding positions can be occupied at any time. Where fielders are positioned is a tactical decision made by the captain of the fielding team. The captain (usually in consultation with the bowler and sometimes other members of the team) may move players between fielding positions at any time except when a bowler is in the act of bowling to a batter, though there are exceptions for fielders moving in anticipation of the ball being hit to a particular area.[2]
                <br />
                There are a number of named basic fielding positions, some of which are employed very commonly and others that are used less often. However, these positions are neither fixed nor precisely defined, and fielders can be placed in positions that differ from the basic positions. The nomenclature of the positions is somewhat esoteric, but roughly follows a system of polar coordinates – one word (leg, cover, mid-wicket) specifies the angle from the batter, and is sometimes preceded by an adjective describing the distance from the batter (silly, short, deep or long). Words such as "backward", "forward", or "square" can further indicate the angle.
                <br />
                The image shows the location of most of the named fielding positions based on a right-handed batter. The area to the left of a right-handed batter (from the batter's point of view – facing the bowler) is called the leg side or on side, while that to the right is the off side. If the batter is left-handed, the leg and off sides are reversed and the fielding positions are a mirror image of those shown.                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Catching positions</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    Some fielding positions are used offensively. That is, players are put there with the main aim being to catch out the batter rather than to stop or slow down the scoring of runs. These positions include Slip (often there are multiple slips next to each other, designated First slip, Second slip, Third slip, etc., numbered outwards from the wicket-keeper – collectively known as the slip cordon) meant to catch balls that just edge off the bat; Gully; Fly slip; Leg slip; Leg gully; the short and silly positions. Short leg, also known as bat pad, is a position specifically intended to catch balls that unintentionally strike the bat and leg pad, and thus end up only a metre or two to the leg side.
                </p>
            </div>
            <div style={{marginLeft:'10px'}}>
                <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Restrictions on field placement</h1>
                <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    Fielders may be placed anywhere on the field, subject to the following rules. At the time the ball is bowled:
                    <br />
                    No fielder may be standing on or with any part of their body over the pitch (the central strip of the playing area between the wickets). If their body casts a shadow over the pitch, the shadow must not move until after the batter has played (or had the opportunity to play) at the ball.
                    There may be no more than two fielders, other than the wicket-keeper, standing in the quadrant of the field behind square leg. See Bodyline for details on one reason this rule exists.
                    In some one-day matches:
                    During designated overs of an innings (see Powerplay), there may be no more than two fielders standing outside an oval line marked on the field, being semicircles centred on the middle stump of each wicket of radius 30 yards (27 m), joined by straight lines parallel to the pitch. This is known as the fielding circle.
                    For overs no. 11-40 (powerplay 2), no more than four fielders should be outside the 30-yard circle.
                    For overs no. 41-50 (powerplay 3) maximum of five fielders are allowed to be outside the 30-yard circle.
                    The restriction for one-day cricket is designed to prevent the fielding team from setting extremely defensive fields and concentrating solely on preventing the batting team from scoring runs.
                    If any of these rules is violated, an umpire will call the delivery a no-ball. Additionally a player may not make any significant movement that is not in response to the striker's actions after the ball comes into play and before the ball reaches the striker. If this happens, an umpire will call and signal 'dead ball'. For close fielders, anything other than minor adjustments to stance or position in relation to the striker is significant. In the outfield, fielders may move in towards the striker or striker's wicket; indeed, they usually do. However, anything other than slight movement off line or away from the striker is to be considered significant.
                </p>
            </div>
            <div ref={sectionFourRef} style={{padding:'2px, 1px'}}>
                <h1 style={{fontSize:'50px', fontWeight:'bolder'}}>Common Injuries</h1>
                <div style={{borderBottom: '2px solid black' , height:'20px'}}>

                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Shoulder</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview</strong>:
                        Shoulder injuries are common in cricket, especially among bowlers who repeatedly put stress on their shoulders. Fast bowlers, in particular, are prone to rotator cuff injuries, dislocations, and tendonitis. Fielders may also experience shoulder strain due to diving and throwing.
                        <br />
                        <strong>Symptoms:</strong>
                        <br />
                        Pain during throwing or bowling
                        <br />
                        Limited range of motion in the shoulder
                        <br />
                        Weakness or instability in the shoulder
                        <br />
                        Swelling or bruising
                        <br />
                        <strong>First Aid and Treatment:</strong>
                        <br />

                        Rest: Avoid activities that exacerbate the pain, such as bowling or throwing.
                        <br />
                        Ice: Apply an ice pack to the shoulder for 15–20 minutes every 2–3 hours to reduce swelling and pain.
                        <br />
                        Compression: Use a compression bandage to prevent swelling, but not too tight.
                        <br />
                        Elevation: Keep the shoulder elevated (if possible) to reduce inflammation.
                        <br />
                        Pain Relief: Nonsteroidal anti-inflammatory drugs (NSAIDs) such as ibuprofen can help manage pain and reduce inflammation.
                        <br />
                        Physiotherapy: A rehabilitation program to strengthen shoulder muscles, improve range of motion, and prevent further injury.
                        <br />
                        Prevention: Proper warm-up, strength training, and correct bowling/throwing techniques are essential for preventing shoulder injuries.
                        <br />
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Elbow</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview:</strong>
                        Elbow injuries in cricket are often caused by repetitive stress, particularly for bowlers. Fast bowlers are especially vulnerable to conditions like tennis elbow (lateral epicondylitis), ligament strains, or stress fractures due to the force generated during delivery.

                        <br />
                        <strong>Symptoms:</strong>
                        <br />

                        Pain on the outside or inside of the elbow
                        <br />
                        Tenderness around the elbow joint
                        <br />
                        Swelling and bruising
                        <br />
                        Reduced ability to extend the arm or grip tightly
                        <br />
                        <strong>First Aid and Treatment:</strong>
                        <br />

                        Rest: Avoid activities that put strain on the elbow.
                        <br />
                        Ice: Apply ice to the elbow for 15–20 minutes several times a day to reduce swelling and alleviate pain.
                        <br />
                        Compression: Use an elbow brace or compression bandage to reduce swelling and provide stability.
                        <br />
                        Elevation: If the elbow is swollen, elevate it above heart level to reduce fluid buildup.
                        <br />
                        Pain Relief: NSAIDs like ibuprofen can help manage pain and inflammation.
                        <br />
                        Physiotherapy: Specific exercises to strengthen the muscles around the elbow, improve flexibility, and prevent re-injury.
                        <br />
                        Prevention: Proper technique and adequate rest between sessions of bowling or throwing are essential for avoiding elbow injuries.  
                        <br />                 
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Hand</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview:</strong>
                    <br />
                    Hands are vulnerable to injuries in cricket due to the impact of the ball or improper technique during batting and fielding. Finger fractures, sprains, and soft tissue injuries are common.
                    <br />
                    <strong>Symptoms:</strong>
                    <br />

                    Pain and swelling in the fingers or hand
                    <br />
                    Bruising or deformity in the fingers
                    <br />
                    Limited movement or inability to grip objects
                    <br />
                    <strong>First Aid and Treatment:</strong>
                    <br />

                    Rest: Rest the hand and avoid using it for activities that require gripping or force.
                    <br />
                    Ice: Apply ice to the injured hand or finger to reduce swelling and pain.
                    <br />
                    Compression: Use a bandage or splint to immobilize the injured area and prevent further injury.
                    <br />
                    Elevation: Elevate the hand to reduce swelling, especially in case of a sprain or soft tissue injury.
                    <br />
                    Pain Relief: Over-the-counter pain relief medications such as ibuprofen or acetaminophen can be used to reduce pain and inflammation.
                    <br />
                    Splinting: For fractures, immobilize the hand using a splint or a finger buddy taping technique.
                    <br />
                    Medical Attention: For fractures or suspected breaks, seek immediate medical attention. A doctor may need to set the bone or provide a cast.
                    <br />
                    Prevention: Proper grip technique, wearing protective gloves, and using the correct hand positioning during batting and fielding can help prevent injuries. 
                    <br />                   
                </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Knee</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview:</strong>
                    <br />
                        Knee injuries are common in cricket, especially for bowlers due to high-impact movements. Batsmen and fielders are also at risk from sudden pivots or strains.
                        <br />
                        <strong>Symptoms:</strong>
                        <br />

                        Pain, swelling, and stiffness around the knee.
                        <br />
                        Difficulty bending or straightening the knee.
                        <br />
                        Instability or feeling of the knee giving way.
                        <br />
                        <strong>First Aid and Treatment:</strong>
                        <br />

                        Rest: Avoid weight-bearing on the knee.
                        <br />
                        Ice: Apply ice for 15-20 minutes every 2-3 hours for the first 48 hours.
                        <br />
                        Compression: Use an elastic bandage for support.
                        <br />
                        Elevation: Raise the knee above heart level.
                        <br />
                        Pain Relief: NSAIDs for pain and swelling.
                        <br />
                        Immobilization: Knee brace if needed.
                        <br />
                        Physiotherapy: Strengthening exercises and mobility work.
                        <br />
                        <strong>Prevention:</strong>
                        <br />

                        Proper Footwear: Wear supportive shoes.
                        <br />
                        Strengthening Exercises: Focus on quadriceps and hamstrings.
                        <br />
                        Warm-Up: Stretch before activity.
                        <br />
                        Technique: Bowlers should focus on proper form to reduce knee stress.  
                        <br />                  </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Foot and Ankle</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview:</strong>
                    <br />
                        Foot and ankle injuries in cricket are common due to the dynamic nature of the sport. Fast bowlers, batsmen, and fielders are all susceptible to injuries such as sprains, fractures, and tendinitis. Ankle sprains are particularly common during sudden sprints or direction changes.
                    <br />
                        <strong>Symptoms:</strong>
                        <br />
                        Pain, swelling, and bruising around the foot or ankle
                        <br />
                        Limited mobility or inability to bear weight on the foot
                        <br />
                        Tenderness when pressing on specific areas of the foot or ankle
                        <br />
                        <strong>First Aid and Treatment:</strong>
                        <br />

                        Rest: Avoid putting weight on the affected foot or ankle.
                        <br />
                        Ice: Apply ice to the foot or ankle to reduce swelling and pain. Ice for 15–20 minutes every 2–3 hours during the first 48 hours.
                        <br />
                        Compression: Wrap the foot or ankle with an elastic bandage to reduce swelling and provide support.
                        <br />
                        Elevation: Keep the foot elevated above heart level to reduce swelling.
                        <br />
                        Pain Relief: NSAIDs such as ibuprofen can reduce pain and swelling.
                        <br />
                        Immobilization: For sprains, fractures, or severe injuries, an ankle brace or boot may be necessary to immobilize the area.
                        <br />
                        Physiotherapy: A physiotherapist may provide exercises to strengthen the foot and ankle muscles and improve mobility.
                        <br />
                        Prevention: Proper footwear, strengthening exercises for the legs and ankles, and warm-ups to improve flexibility can help prevent foot and ankle injuries.
                        <br />
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Hamstring Strain in Cricket</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    A hamstring strain occurs when the muscles at the back of the thigh are overstretched or overloaded, leading to partial or full tears. It is common among fast bowlers, batsmen, and fielders who perform quick sprints or explosive movements.
                        <br />
                        <span style={{fontWeight:'bold'}}>Symptoms:</span>
                        <br />
                        Sharp pain in the back of the thigh
                        Swelling and bruising
                        Difficulty walking, running, or performing movements involving the leg
                        <br />
                        <span style={{fontWeight:'bold'}}>First Aid and Treatment:</span>
                        <br />
                        R.I.C.E Method:
                        <br />
                        Rest: Avoid any activity that puts strain on the hamstring.
                        <br />
                        Ice: Apply ice to the injured area for 15-20 minutes every 2-3 hours to reduce swelling and pain.
                        <br />
                        Compression: Use an elastic bandage to wrap the area and minimize swelling.
                        <br />
                        Elevation: Keep the leg elevated above heart level to reduce swelling.
                        <br />
                        Physiotherapy: Once the acute pain reduces, a rehabilitation program focusing on strengthening and stretching the hamstrings is crucial.
                        <br />
                        Prevention: Warm up before activity, engage in strength training, and incorporate flexibility exercises into the training regimen.
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Lumbar Stress Fracture</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                        <span style={{fontWeight:'bold'}}>Overview:</span>
                        <br />
                        A lumbar stress fracture is a common injury among fast bowlers due to repetitive stress on the lower back. It involves small cracks in the vertebrae caused by overuse or improper technique.
                        <br />
                        <span style={{fontWeight:'bold'}}>Symptoms:</span>
                        <br />
                        Lower back pain that worsens during bowling or other physical activities
                        <br />
                        Pain that improves with rest but returns with activity
                        <br />
                        Stiffness in the lower back
                        <br />
                        <span style={{fontWeight:'bold'}}>First Aid and Treatment:</span>
                        <br />

                        Rest: Avoid all high-impact activities and sports to allow the spine to heal.
                        <br />
                        Ice: Apply ice packs to the lower back for 15–20 minutes at a time to reduce inflammation.
                        <br />
                        Pain Relief: Over-the-counter painkillers such as ibuprofen or acetaminophen can help reduce pain and inflammation.
                        <br />
                        Physical Therapy: A physiotherapist can guide you through exercises that strengthen the core and improve posture, which will relieve stress on the lower back.
                        <br />
                        Bracing or Surgery: In severe cases, a back brace or even surgery may be needed.
                        <br />
                        Prevention: Strengthen the core muscles and work on improving bowling technique to reduce the risk of stress fractures in the future.
                        <br />
                    </p>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <h1 style={{fontSize:'30px', fontWeight:'bold'}}>Bowling Injuries</h1>
                    <p style={{fontFamily:'revert', fontSize:'20px', padding:'2px, 1px', marginLeft:'10px', marginRight:'5px', textAlign:'left'}}>
                    <strong>Overview:</strong>
                    Bowling, especially fast bowling, places a lot of strain on various parts of the body, making bowlers vulnerable to injuries like shoulder, elbow, and lower back injuries.
                    <br />
                    <strong>Common Injuries:</strong>
                    <br />
                    Rotator cuff injuries in the shoulder
                    Elbow ligament strains or stress fractures
                    Lower back pain or stress fractures
                    <br />
                    <strong>First Aid and Treatment:</strong>
                    <br />
                    Rest: Rest is crucial to avoid aggravating the injury.
                    <br />
                    Ice: Apply ice packs on the affected area to reduce swelling and pain, especially for the shoulder or elbow.
                    <br />
                    Compression and Elevation: Use compression sleeves or bandages for elbow or shoulder injuries and keep the injured area elevated to reduce swelling.
                    <br />
                    Physiotherapy: Rehabilitation exercises focusing on strength and flexibility are essential, especially for the shoulder, elbow, and back.
                    <br />
                    Medication: Pain relievers such as ibuprofen can help with inflammation and pain.
                    <br />
                    Prevention: Proper warm-up, strengthening the shoulder and back muscles, and using correct bowling techniques can help prevent these injuries.  
                    <br />                 
                     </p>
                </div>
            </div>
        </div>
        <br />
        <div class="floating-buttons-container">
            <button onClick={() => scrollToSection(sectionOneRef)} className="floating-button2"><LucideArrowBigUp /></button>
            <button onClick={() => scrollToSection(sectionFiveRef)} className="floating-button"><LucideArrowBigDown /></button>
        </div>
        <div ref={sectionFiveRef}>

        </div>
        <Footer />
    </>
  )
}

export default Cricket
