/* Constants: change them to customize the columns */
// Initial width percentage of left pane (e.g. 0.4 for 40%/60%)
var offset = 0.70;

// Limit from left/right that you can drag to. Must be smaller than offset
var limit = 0.25;


/* Global variables, manipulated later */
var left, right, panes_width, panes_offset, bounds;
var $panes, $drag;


/* Resizes the columns and handles column widths limits */
function resize_col() {
  if (offset >= limit && offset <= (1 - limit)) {
    $drag.draggable('option', 'revert', false);
    left.style.width = offset * panes_width + 'px';
    right.style.width = (1 - offset) * panes_width - 5 + 'px';
  } else {
    // Just in case we somehow go past the limit
    $drag.draggable('option', 'revert', true);
    offset = (offset < limit) ? limit : (1 - limit);
  }
}

/* Makes the bar draggable only along x-axis, containing to the panes box,
   and handles the actual dragging event */
function make_draggable() {
  $drag.draggable({
    axis: 'x',
    containment: bounds,
    revertDuration: 250,
    drag: function(event, ui) {
      // Update values in case they changed
      panes_width = $panes.width();
      panes_offset = $panes.offset();

      // Calculate offset and resize
      offset = (ui.offset.left - panes_offset.left) / panes_width;
      resize_col();
    }
  });
}

/* Calculates the bounds for the drag bar */
function calculate_bounds() {
  bounds = [panes_offset.left + limit * panes_width,
            panes_offset.top,
            panes_offset.left + panes_width - (limit * panes_width) - 5,
            panes_offset.top + $panes.height()];
}

/* On page load: get DOM elements, calculate some stuff,
   and initialize the drag bar/columns.  */
$(document).ready(function() {
  left   = document.getElementById('left-pane');
  right  = document.getElementById('right-pane');
  $panes = $('#panes');
  $drag  = $('#drag');
  panes_width  = $panes.width();
  panes_offset = $panes.offset();

  // Bounding box, taking the limit into account
  calculate_bounds();

  // Make sure the constants given are valid/positive
  offset = Math.abs(offset);
  limit  = Math.abs(limit);

  // Initialize the drag bar and resize the columns
  make_draggable();
  $drag.css('left', (panes_offset.left + offset * panes_width) + 'px');
  resize_col();
});

/* Handle window resizing */
// NOTE: Don't manually override window.onresize. This will conflict with
// other such uses, as we do in menu.js (TODO: change that one, too).
window.addEventListener('resize', function(event) {
  panes_width = $panes.width();
  panes_offset = $panes.offset();
  resize_col();

  // Update bounds
  calculate_bounds();
  $drag.draggable('destroy');
  make_draggable();

  // Make sure the drag bar stays in the right place
  $drag.css('left', (panes_offset.left + offset * panes_width) + 'px');
});
