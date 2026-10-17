<?php
// Dunewood Academy API — auto-creates database + tables on first run.
// Edit credentials for your XAMPP (default root / no password).
$HOST='127.0.0.1';$USER='root';$PASS='';$NAME='dunewood_school';
header('Content-Type: application/json');
$S=[ // table => [column => type]  (i = int, s = string)
 'teachers'=>['id'=>'s','name'=>'s','subject'=>'s','phone'=>'s','email'=>'s','salary'=>'i','status'=>'s'],
 'classes'=>['id'=>'s','name'=>'s','teacherId'=>'s','room'=>'s','capacity'=>'i'],
 'students'=>['id'=>'s','name'=>'s','classId'=>'s','gender'=>'s','dob'=>'s','guardian'=>'s','phone'=>'s','address'=>'s','status'=>'s'],
 'exams'=>['id'=>'s','name'=>'s','date'=>'s'],
 'grades'=>['id'=>'s','studentId'=>'s','examId'=>'s','subject'=>'s','score'=>'i'],
 'attendance'=>['id'=>'s','studentId'=>'s','date'=>'s','status'=>'s'],
 'fees'=>['id'=>'s','studentId'=>'s','title'=>'s','amount'=>'i','paid'=>'i','due'=>'s'],
 'books'=>['id'=>'s','title'=>'s','author'=>'s','copies'=>'i','borrowedBy'=>'s','due'=>'s'],
 'notices'=>['id'=>'s','title'=>'s','date'=>'s','body'=>'s'],
 'timetable'=>['id'=>'s','classId'=>'s','day'=>'s','period'=>'i','subject'=>'s'],
];
try{
 $pdo=new PDO("mysql:host=$HOST;charset=utf8mb4",$USER,$PASS,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
 $pdo->exec("CREATE DATABASE IF NOT EXISTS `$NAME` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
 $pdo->exec("USE `$NAME`");
 foreach($S as $t=>$cols){$d=[];foreach($cols as $c=>$ty)$d[]=$c=='id'?"`id` VARCHAR(16) PRIMARY KEY":($ty=='i'?"`$c` INT NOT NULL DEFAULT 0":($c=='body'?"`$c` TEXT":"`$c` VARCHAR(255) NOT NULL DEFAULT ''"));
  $pdo->exec("CREATE TABLE IF NOT EXISTS `$t` (".implode(',',$d).") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");}
 $pdo->exec("CREATE TABLE IF NOT EXISTS settings (k VARCHAR(50) PRIMARY KEY, v VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
 if(($_GET['action']??'')==='load'){
  $out=[];foreach($S as $t=>$_)$out[$t]=$pdo->query("SELECT * FROM `$t`")->fetchAll(PDO::FETCH_ASSOC);
  foreach($S as $t=>$cols)foreach($out[$t] as &$r)foreach($cols as $c=>$ty)if($ty=='i')$r[$c]=(int)$r[$c];
  $out['settings']=$pdo->query("SELECT k,v FROM settings")->fetchAll(PDO::FETCH_KEY_PAIR);
  $out['empty']=!count($out['students']);echo json_encode($out);exit;
 }
 if(($_GET['action']??'')==='save'){
  $in=json_decode(file_get_contents('php://input'),true);if(!$in)throw new Exception('bad payload');
  $pdo->beginTransaction();
  foreach($S as $t=>$cols){$pdo->exec("DELETE FROM `$t`");$names=array_keys($cols);
   $st=$pdo->prepare("INSERT INTO `$t` (`".implode('`,`',$names)."`) VALUES (".implode(',',array_fill(0,count($names),'?')).")");
   foreach($in[$t]??[] as $r){$v=[];foreach($cols as $c=>$ty)$v[]=$ty=='i'?(int)($r[$c]??0):(string)($r[$c]??'');$st->execute($v);}}
  $pdo->exec("DELETE FROM settings");$st=$pdo->prepare("INSERT INTO settings VALUES (?,?)");
  foreach($in['settings']??[] as $k=>$v)$st->execute([$k,$v]);
  $pdo->commit();echo '{"ok":true}';exit;
 }
 echo '{"error":"unknown action"}';
}catch(Throwable $e){http_response_code(500);echo json_encode(['error'=>$e->getMessage()]);}
