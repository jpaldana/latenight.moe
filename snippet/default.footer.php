		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script src="https://code.jquery.com/jquery-3.2.1.min.js" crossorigin="anonymous"></script>
		<script>window.jQuery || document.write('<script src="/assets/js/jquery-3.2.1.min.js"><\/script>')</script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
		<script src="/assets/js/bootstrap.min.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script src="/assets/js/ie10-viewport-bug-workaround.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.3.0/firebase.js"></script>

		<script>
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyDOyoqukrUMVXXC98pqt9RvXDgccHGcyFQ",
			authDomain: "aftermirror-gcp-fb.firebaseapp.com",
			databaseURL: "https://aftermirror-gcp-fb.firebaseio.com",
			projectId: "aftermirror-gcp-fb",
			storageBucket: "aftermirror-gcp-fb.appspot.com",
			messagingSenderId: "234692929777"
		};
		firebase.initializeApp(config);

		var database = firebase.database();
		</script>
		
		<?php
			if (isset($data) && isset($data["js"])) {
				foreach ($data["js"] as $js) {
					echo "<script src='{$js}" . CSS_APPEND . "'></script>";
				}
			}
		?>

		<div class="container page-footer">
			<p>
				Made with <i class="fa fa-heart"></i>
				<br />
				latenight.moe &raquo; part of the <a href="https://aftermirror.com">aftermirror.com</a> project
				<br />
				<br />
				Questions? Comments? Concerns? DMCA takedown notices? Email me at <a href="mailto:admin@aftermirror.com">admin@aftermirror.com</a>
			</p>
		</div>

		<div id="page-loader">
			<div class='page-loader-text'>
				<h4>Please wait...</h4
				><p>This shouldn't take that long. <img src='/assets/images/ripple.svg' style='width: 32px;' /></p>
			</div>
		</div>
		<script src="/assets/js/jquery.lazy.min.js"></script>
		<script src="/assets/js/ui.js<?php echo CSS_APPEND; ?>"></script>
	</body>
</html>