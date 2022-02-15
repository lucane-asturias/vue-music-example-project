<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid' : is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)">
        <h5>{{ $t('upload.drop_files') }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)">
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar"
            :class="upload.color"
            :style="{ width: upload.current_progress + '%' }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false;
      // console.log($event)
      // converting both objects spreading to an array
      const files = $event.dataTransfer 
      ? [...$event.dataTransfer.files] // if event drag and drop
      : [...$event.target.files]; // else, event input file

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return; // end the current iteration
        }

        if (!navigator.onLine) { // if user is not online, they can't upload files
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            color: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          return;
        }

        // creating reference which represents the path to storage (aka  the bucketURL) 
        // to let firebase know where to upload the file
        const storageRef = storage.ref();
        // music-c14fa.appspot.com/songs/example.mp3
        const songsRef = storageRef.child(`songs/${file.name}`);
        // result of uploading file to firebase storage
        const task = songsRef.put(file);
        // get last item in the array subtracting by one
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          color: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        // The snapshot object contains information about the current upload
        // On is a listener to the state changed event, which will get emitted whenever the upload has progressed
        task.on('state_changed', (snapshot) => {
          // calculation to get the percentage of how much has been uploaded so far
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // use the calculation above to update the current progress property corresponding to the object that represents the current upload.
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
          // on error
          this.uploads[uploadIndex].color = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
          console.log(error)
        }, async () => {
          // on success
          const song = {
            // get id from currentUser object who's logged into the applicattion
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: '',
            comment_count: 0,
          }
          // new property: url to the file where its stored publicly
          song.url = await task.snapshot.ref.getDownloadURL();
          // add object to songs collection as document (add generate random id)
          const songRef = await songsCollection.add(song);
          const songSnapShot = await songRef.get(); // returns a snapshot

          this.addSong(songSnapShot);

          this.uploads[uploadIndex].color = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';
        });
      })

      // console.log(files);
    },
    cancelUploads() { // not using ref
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  }
}
</script>