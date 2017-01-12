<% layout('layout') -%>

<script>
        function showCover() {
          var coverDiv = document.createElement('div');
          coverDiv.id = 'cover-div';
          document.body.appendChild(coverDiv);
        }

        function hideCover() {
          document.body.removeChild(document.getElementById('cover-div'));
        }

        function showPrompt(text, callback) {
          showCover();
          var form = document.getElementById('prompt-form');
          var container = document.getElementById('prompt-form-container');
          document.getElementById('prompt-message').innerHTML = text;

          function complete(value) {
            hideCover();
            container.style.display = 'none';
            document.onkeydown = null;
            callback(value);
          }

          form.onsubmit = function() {
            complete(value);
            return false;
          };

          form.elements.cancel.onclick = function() {
            complete(null);
          };

          document.onkeydown = function(e) {
            if (e.keyCode == 27) { // escape
              complete(null);
            }
          };

          var lastElem = form.elements[form.elements.length - 1];
          var firstElem = form.elements[0];

          lastElem.onkeydown = function(e) {
            if (e.keyCode == 9 && !e.shiftKey) {
              firstElem.focus();
              return false;
            }
          };

          firstElem.onkeydown = function(e) {
            if (e.keyCode == 9 && e.shiftKey) {
              lastElem.focus();
              return false;
            }
          };

          container.style.display = 'block';
          form.elements.text.focus();
        }
</script>

<section class="bands">
  <div class="pagination">
    <%
      page = parseInt(page);
      nextPage = page + 1;
      prevPage = page - 1;
      skipped = parseInt(skipped);
      count = parseInt(count);

      if(skipped + arr.length < count) {%>
        <a href='?page=<%=nextPage%>' title="prev">Next</a>
      <%}
      %>
      <% if(page-1 >=1) {%>
        <a href="?page=<%=prevPage%>" title="prev">Previous</a>%>
      <%} %>
      <% if(page-1 ==0) {%>
        <a href="/bands" title="prev">Previous</a>%>
      <%} %>


  </div>
  <div class="search">
    <form  method="get">
      <input type="text" name="name" />
      <input type="submit" />
    </form>
  </div>
  <script>
    function scaleBig(x)
    {
      var b = x.children;
      var c = b[0].children;
      var d = c[0].children;
      d[0].style.transform = "scale(1.1)";
      var e = c[1].children;
      e[0].style.color = "#00fdff";
        e[0].style.fontSize = "25px";
    }
    function scaleSmall(x)
    {
      var b = x.children;
      var c = b[0].children;
      var d = c[0].children;
      d[0].style.transform = "scale(1)";
      var e = c[1].children;
      e[0].style.color =   "#fff";
      e[0].style.fontSize = "20px";
    }
  </script>

  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <span class="close">&times;</span>
      <p id="yesDelete">Yes delete</p>
    </div>

  </div>


  <%
   for (var i = 0; i < arr.length; i++) {

     %>

    /* <a title='<%=arr[i].name %>' href="/bands/<%=arr[i]._id%>" onmouseover="scaleBig(this)" onmouseout="scaleSmall(this)" >*/
     <div class="bands_row">
     <div class="bands_remove">
     /*<!--       <form  method="post" action="/bands/delete" onsubmit="deleteConfirm();">
            <input name="id" type="hidden" value='<%=arr[i]._id%>'>
            <input type="submit" />
            </form>-->*/
            <input type="button" value="Remove drug" id="show-button">
            <div id="prompt-form-container">
               <form method="post" id="prompt-form" action="/bands/delete">
                 <div id="prompt-message"></div>
                   <input name="id" type="hidden" value='<%=arr[i]._id%>'>
                 <input type="submit" value="Yes">
                 <input type="button" name="cancel" value="Cancel">
               </form>
             </div>
            </div>
     <div class="bands_image">
     <img alt='<%= arr[i].name %>'>
     </div>
     <div class="bands_name">
     <h2><%= arr[i].name %></h2></div>
     </div>
  <%}%>

  <script>
  function popUp(){
    var modal = document.getElementById('myModal');
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    var yes = document.getElementById("yesDelete");
    modal.style.display = "block";
    yes.onclick = function (){
      console.log('click');
      modal.style.display = "none";
      return true;
    }
    span.onclick = function() {
        console.log('span');
        modal.style.display = "none";
        return false;
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            console.log('window');
            modal.style.display = "none";
            return false;
        }
  }
}
  function deleteConfirm(e){
    e.preventDefault();
      return popUp();
    }


  </script>
</section>
</div>
<script>
document.getElementById('show-button').onclick = function() {
  showPrompt("Are you want to remove this item?", function(value) {
});
};
</script>
