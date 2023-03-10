import React, { useState } from "react";
// import { Configuration, OpenAIApi } from "openai";
// import * as dotenv from "dotenv";
// require('dotenv').config()

// // TODO: This is a security risk and should be moved to the backend
// const configuration = new Configuration({
//   organization: process.env.OPENAI_ORG_ID,
//   apiKey: process.env.OPENAI_API_SECRET_KEY,
// });
// const openai = new OpenAIApi(configuration);

interface SongFormProps {
  onSubmit: (formData: FormData) => void;
}

const SongForm: React.FC<SongFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [numCopiesStr, setNumCopies] = useState<string>("");
  const [pricePerUnitStr, setPricePerUnit] = useState<string>("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [promptText, setPromptText] = useState<string>("");

  // const handlePromptTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPromptText(e.target.value);
  // };

  // const generateCoverArt = async () => {
  //   try {
  //     const response = await openai.createImage({
  //       prompt: promptText,
  //       n: 1,
  //       size: "512x512",
  //     });
  //     const imageUrlOption = response.data.data[0].url;
  //     let imageUrl: string;
  //     if (imageUrlOption !== undefined) {
  //       imageUrl = imageUrlOption as string;
  //     } else {
  //       return;
  //     }
  //     setImagePreview(imageUrl);
  //     const generatedImage = await fetch(imageUrl);
  //     const blob = await generatedImage.blob();
  //     const imageFileGen = new File([blob], "generatedAIImage", { type: blob.type });
  //     setImageFile(imageFileGen);
  //   } catch(error: any) {
  //     console.log(error.message);
  //   }
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
    switch (e.target.name) {
        case "title":
          setTitle(e.target.value);
          break;
        case "artist":
          setArtist(e.target.value);
          break;
        case "album":
          setAlbum(e.target.value);
          break;
        case "genre":
          setGenre(e.target.value);
          break;
        case "numCopiesStr":
          setNumCopies(e.target.value);
          break;
        case "pricePerUnitStr":
          setPricePerUnit(e.target.value);
          break;
    }
  };

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSongFile(e.target.files[0]);
    }
  };

  /**
   * Function that checks if inputted images have a 1:1 aspect ratio
   * and are > 500x500px and <= 1500x1500px.
   * @param file Image file uploaded by user
   * @returns Promise that either contains 
   */
  const checkImageSizeAndAspectRatio = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const img = new Image();
        img.src = event.target.result as string;
        img.onload = () => {
          console.log(`Width: ${img.width} Height: ${img.height}`);
          if (
            img.width < 500 ||
            img.width > 1500 ||
            img.height < 500 ||
            img.height > 1500 ||
            img.width !== img.height
          ) {
            setImageFile(null);
            setImagePreview(null);
            alert("Please upload a square image between 500px and 1500px on each side.");
          } else {
            setImagePreview(img.src);
            setImageFile(file);
            console.log(`Image preview: ${imagePreview}`);
          }
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        checkImageSizeAndAspectRatio(e.target.files[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !artist || !album || !genre || !numCopiesStr || !pricePerUnitStr || !songFile || !imageFile) {
      alert('Please fill in all required fields.');
      return;
    } else if (imageFile.type !== 'image/jpeg') {
      alert('Please upload a JPEG image.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    const TONIC_CUT = 0.1;  // 10% of initial sale
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);
    const artistPubKeyStr = "4U3SKTHbUuvVTZkeY3jijhyX2y7147E3KvTVQTpM8EDy";  // Grant's addy for testing
    formData.append("artistPubKeyStr", artistPubKeyStr);
    formData.append("numCopiesStr", numCopiesStr);
    formData.append("tonicCutStr", TONIC_CUT.toString());
    formData.append("pricePerUnitStr", pricePerUnitStr);
    if (songFile) {
      formData.append("songFile", songFile);
    }
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="artist">Artist:</label>
        <input type="text" id="artist" name="artist" required onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="album">Album:</label>
        <input type="text" id="album" name="album" required onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" name="genre" required onChange={handleInputChange}>
          <option value="">--Select Genre--</option>
          <option value="acapella">Acapella</option>
          <option value="acid">Acid</option>
          <option value="acid-jazz">Acid Jazz</option>
          <option value="acid-punk">Acid Punk</option>
          <option value="acoustic">Acoustic</option>
          <option value="alternative">Alternative</option>
          <option value="alternative-rock">Alternative Rock</option>
          <option value="ambient">Ambient</option>
          <option value="anime">Anime</option>
          <option value="avantgarde">Avantgarde</option>
          <option value="ballad">Ballad</option>
          <option value="bass">Bass</option>
          <option value="beat">Beat</option>
          <option value="bebob">Bebob</option>
          <option value="big-band">Big Band</option>
          <option value="black-metal">Black Metal</option>
          <option value="bluegrass">Bluegrass</option>
          <option value="blues">Blues</option>
          <option value="booty-bass">Booty Bass</option>
          <option value="britpop">BritPop</option>
          <option value="cabaret">Cabaret</option>
          <option value="celtic">Celtic</option>
          <option value="chamber-music">Chamber Music</option>
          <option value="chanson">Chanson</option>
          <option value="chorus">Chorus</option>
          <option value="christian-gangsta-rap">Christian Gangsta Rap</option>
          <option value="christian-rap">Christian Rap</option>
          <option value="christian-rock">Christian Rock</option>
          <option value="classic-rock">Classic Rock</option>
          <option value="classical">Classical</option>
          <option value="club">Club</option>
          <option value="club---house">Club - House</option>
          <option value="comedy">Comedy</option>
          <option value="contemporary-christian">Contemporary Christian</option>
          <option value="country">Country</option>
          <option value="crossover">Crossover</option>
          <option value="cult">Cult</option>
          <option value="dance">Dance</option>
          <option value="dance-hall">Dance Hall</option>
          <option value="darkwave">Darkwave</option>
          <option value="death-metal">Death Metal</option>
          <option value="disco">Disco</option>
          <option value="dream">Dream</option>
          <option value="drum-&-bass">Drum & Bass</option>
          <option value="drum-solo">Drum Solo</option>
          <option value="duet">Duet</option>
          <option value="easy-listening">Easy Listening</option>
          <option value="electronic">Electronic</option>
          <option value="ethnic">Ethnic</option>
          <option value="euro-house">Euro-House</option>
          <option value="euro-techno">Euro-Techno</option>
          <option value="eurodance">Eurodance</option>
          <option value="fast-fusion">Fast Fusion</option>
          <option value="folk">Folk</option>
          <option value="folk-rock">Folk-Rock</option>
          <option value="folklore">Folklore</option>
          <option value="freestyle">Freestyle</option>
          <option value="funk">Funk</option>
          <option value="fusion">Fusion</option>
          <option value="game">Game</option>
          <option value="gangsta">Gangsta</option>
          <option value="goa">Goa</option>
          <option value="gospel">Gospel</option>
          <option value="gothic">Gothic</option>
          <option value="gothic-rock">Gothic Rock</option>
          <option value="grunge">Grunge</option>
          <option value="hard-rock">Hard Rock</option>
          <option value="hardcore">Hardcore</option>
          <option value="heavy-metal">Heavy Metal</option>
          <option value="hip-hop">Hip-Hop</option>
          <option value="house">House</option>
          <option value="humour">Humour</option>
          <option value="indie">Indie</option>
          <option value="industrial">Industrial</option>
          <option value="instrumental">Instrumental</option>
          <option value="instrumental-pop">Instrumental Pop</option>
          <option value="instrumental-rock">Instrumental Rock</option>
          <option value="jpop">JPop</option>
          <option value="jazz">Jazz</option>
          <option value="jazz+funk">Jazz+Funk</option>
          <option value="jungle">Jungle</option>
          <option value="latin">Latin</option>
          <option value="lo-fi">Lo-Fi</option>
          <option value="meditative">Meditative</option>
          <option value="merengue">Merengue</option>
          <option value="metal">Metal</option>
          <option value="musical">Musical</option>
          <option value="national-folk">National Folk</option>
          <option value="native-us">Native US</option>
          <option value="negerpunk">Negerpunk</option>
          <option value="new-age">New Age</option>
          <option value="new-wave">New Wave</option>
          <option value="noise">Noise</option>
          <option value="oldies">Oldies</option>
          <option value="opera">Opera</option>
          <option value="polka">Polka</option>
          <option value="polsk-punk">Polsk Punk</option>
          <option value="pop">Pop</option>
          <option value="pop-folk">Pop-Folk</option>
          <option value="pop/funk">Pop/Funk</option>
          <option value="porn-groove">Porn Groove</option>
          <option value="power-ballad">Power Ballad</option>
          <option value="pranks">Pranks</option>
          <option value="primus">Primus</option>
          <option value="progressive-rock">Progressive Rock</option>
          <option value="psychadelic">Psychadelic</option>
          <option value="psychedelic-rock">Psychedelic Rock</option>
          <option value="punk">Punk</option>
          <option value="punk-rock">Punk Rock</option>
          <option value="r&b">R&B</option>
          <option value="rap">Rap</option>
          <option value="rave">Rave</option>
          <option value="reggae">Reggae</option>
          <option value="retro">Retro</option>
          <option value="revival">Revival</option>
          <option value="rhythmic-soul">Rhythmic Soul</option>
          <option value="rock">Rock</option>
          <option value="rock-&-roll">Rock & Roll</option>
          <option value="salsa">Salsa</option>
          <option value="samba">Samba</option>
          <option value="satire">Satire</option>
          <option value="showtunes">Showtunes</option>
          <option value="ska">Ska</option>
          <option value="slow-jam">Slow Jam</option>
          <option value="slow-rock">Slow Rock</option>
          <option value="sonata">Sonata</option>
          <option value="soul">Soul</option>
          <option value="sound-clip">Sound Clip</option>
          <option value="soundtrack">Soundtrack</option>
          <option value="southern-rock">Southern Rock</option>
          <option value="space">Space</option>
          <option value="speech">Speech</option>
          <option value="swing">Swing</option>
          <option value="symphonic-rock">Symphonic Rock</option>
          <option value="symphony">Symphony</option>
          <option value="synthpop">Synthpop</option>
          <option value="tango">Tango</option>
          <option value="techno">Techno</option>
          <option value="techno-industrial">Techno-Industrial</option>
          <option value="terror">Terror</option>
          <option value="thrash-metal">Thrash Metal</option>
          <option value="trailer">Trailer</option>
          <option value="trance">Trance</option>
          <option value="tribal">Tribal</option>
          <option value="trip-hop">Trip-Hop</option>
          <option value="vocal">Vocal</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="numCopiesStr">Number of Copies to be Sold:</label>
        <input type="number" id="numCopiesStr" name="numCopiesStr" min="1" max="10000" required onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="pricePerUnitStr">Price per unit:</label>
        <input type="text" id="pricePerUnitStr" name="pricePerUnitStr" pattern="[0-9]+(\.[0-9]{1,2})?" required onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="songFile">Song:</label>
        <input type="file" id="songFile" name="songFile" accept="audio/mp3" required onChange={handleSongFileChange}/>
      </div>
      <div>
        <label htmlFor="imageFile">Cover Art:</label>
        <input type="file" id="imageFile" name="imageFile" accept="image/jpeg" required onChange={handleImageFileChange}/>
        {/* <p>No cover art? Generate some with a prompt:</p>
        <input type="text" placeholder="Enter prompt text" value={promptText} onChange={handlePromptTextChange} />
        <button onClick={generateCoverArt}>Generate cover art</button> */}
        {imagePreview && <img src={imagePreview} alt="Image Preview" />}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SongForm;
