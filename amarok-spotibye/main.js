Importer.loadQtBinding( "qt.core" );
Importer.loadQtBinding( "qt.gui" ); 
//#include <QFileDialog>
//Amarok.alert("Spotibye started.");
//Amarok.Window.Statusbar.setMainText( Amarok.Playlist.totalTrackCount() + " tracks in the playlist");
//Amarok.Window.OSD.setText("TestOSD");
//Amarok.Window.OSD.show();
//Amarok.Collection.query("SELECT * FROM `tracks` JOIN `artists` ON tracks.artist=artists.id JOIN `urls` ON tracks.url=urls.id WHERE (SOUNDEX(tracks.title) = SOUNDEX('Das Beste') OR tracks.title LIKE '%Das Beste%') AND artists.name = 'Silbermond'")
//SELECT * FROM `tracks` JOIN `artists` ON tracks.artist=artists.id JOIN `urls` ON tracks.url=urls.id WHERE MATCH(tracks.title) AGAINST ('%Das Beste%') AND artists.name = 'Silbermond'

// Playlist file
var playlist = "/home/florin/Cloud/Projekte/Spotify/bh_ta_wo_number.txt";
var playlist_local = "/home/florin/Cloud/Projekte/Spotify/bh_spot_local.txt";

QByteArray.prototype.toString = function()
{
   ts = new QTextStream( this, QIODevice.ReadOnly );
   return ts.readAll();
}

var f = new QFile(playlist);
f.open(QIODevice.ReadWrite);
var titles = new Array();
var line = new QTextStream(f);
while (!line.atEnd()) {
	titles.push(line.readLine().toString());
}
f.close();
//Amarok.alert(titles);
// Lookup in database

var missing = new Array();
for (var i in titles) {
	Amarok.debug(i);
	Amarok.debug("Searching for "+titles[i]);
	var metadata = titles[i].split("--");
	var title = metadata[0].trim();
	var author = metadata[1].trim();
	Amarok.debug("Title: "+title);
	Amarok.debug("Author: "+author);
	var result = Amarok.Collection.query("SELECT urls.rpath FROM `tracks` JOIN `artists` on tracks.artist=artists.id JOIN `urls` ON tracks.url=urls.id WHERE (SOUNDEX(tracks.title) = SOUNDEX(\""+title+"\") OR tracks.title LIKE \"%"+title+"%\") AND (artists.name = \""+author+"\" OR SOUNDEX(artists.name) = SOUNDEX(\""+author+"\"))");
	Amarok.debug("Result of DB query: "+result);
	if (result.length>0) {
		for (var j in result) {
			Amarok.debug("URL: "+result[j]);
			// Remove heading .
			var url = (result[j]).substr(1);
			// Add all found audio files to playlist
			//Amarok.Playlist.addMedia(new QUrl("file:"+url));
		}
	} else {
		Amarok.debug("Not found: "+title+ " -- "+author);
		missing.push(title+ " -- "+author);
	}
}
Amarok.debug("Missing files: "+missing);

// Load local files
var f = new QFile(playlist_local);
f.open(QIODevice.ReadWrite);
var titles_local = new Array();
var line = new QTextStream(f);
while (!line.atEnd()) {
	titles_local.push(line.readLine().toString());
}
f.close();
//Amarok.alert(titles);
// Lookup in database

var missing = new Array();
for (var i in titles_local) {
	// Load encoded data
	//Amarok.alert("Missing files: "+titles_local[i]);
	var metadata = titles_local[i].split(":");
	var author_encoded = metadata[2];
	var title_encoded = metadata[4];	
	// Decode
	var author = decodeURIComponent(author_encoded).replace(/\+/g, " ");
	var title = decodeURIComponent(title_encoded).replace(/\+/g, " ");
	Amarok.debug("Missing song: "+author+" - "+title);
		
	// Lookup	
	var result = Amarok.Collection.query("SELECT urls.rpath FROM `tracks` JOIN `artists` on tracks.artist=artists.id JOIN `urls` ON tracks.url=urls.id WHERE (SOUNDEX(tracks.title) = SOUNDEX(\""+title+"\") OR tracks.title LIKE \"%"+title+"%\") AND (artists.name = \""+author+"\" OR SOUNDEX(artists.name) = SOUNDEX(\""+author+"\"))");
	Amarok.debug("Result of DB query: "+result);
	if (result.length>0) {
		for (var j in result) {
			Amarok.debug("URL: "+result[j]);
			// Remove heading .
			var url = (result[j]).substr(1);
			// Add all found audio files to playlist
			Amarok.Playlist.addMedia(new QUrl("file:"+url));
		}
	} else {
		Amarok.debug("Not found locally: "+title+ " -- "+author);
		missing.push(title+ " -- "+author);
	}
}

// Save all files without hit
//var missingFile = new QFile("/home/florin/Cloud/Projekte/Spotify/missing.txt");
//if (missingFile.open(QFile.WriteOnly | QFile.Truncate)) {
//	var out = new QTextStream(missingFile);
//	for (var i in missing) {
//		Amarok.debug("Writing: "+missing[i]+ " to file.");
//		out.writeString(missing[i]);
//	}
//	out.flush();
//	missingFile.close();
//}
Amarok.alert("Missing files: "+missing);
for (var j in missing) {
	Amarok.debug("Missing:	"+missing[j]);
}
