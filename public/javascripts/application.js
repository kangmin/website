(function() {
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  $(function() {
    var Stars, ajaxForm, changeForm, prependVote, saveDraft, showVote, updateVote;
    $('a.resend').click(function() {
      var a;
      a = $(this);
      a.hide().after('<span>Resending&hellip;</span>');
      $.get(this.href, function() {
        return a.next('span').html('Sent!').fadeOut('slow', function() {
          a.next('span').remove();
          return a.fadeIn();
        });
      });
      return false;
    });
    $('a.delete').click(function() {
      return confirm('Are you sure?');
    });
    $('a.reveal').click(function() {
      $(this).hide().next('.hidden').slideDown('fast', function() {
        return $(this).find('input').select();
      });
      return false;
    });
    $(':input:visible:first:not([rel=nofollow])').focus();
    $('input.url').click(function() {
      if (this.value === this.defaultValue) {
        return this.select();
      }
    });
    ajaxForm = function(form, options) {
      options.type = form.attr('method');
      options.url = form.attr('action');
      options.data = form.serialize();
      return $.ajax(options);
    };
    $('form.reset_password').submit(function() {
      var email, form;
      form = $(this);
      email = form.find('input.email').val();
      ajaxForm(form, {
        success: function(data) {
          return form.replaceWith("<h2>" + email + " has been sent a new password</h2>\n<p>It should arrive shortly.</p>");
        },
        error: function(xhr) {
          return $('#errors').append("<li>" + xhr.responseText + "</li>");
        }
      }).slideDown('fast');
      return false;
    });
    $('form').submit(function(evt) {
      var errors, form, hasError, highlightError;
      form = $(this).closest('form');
      errors = $('#errors');
      form.find('input').removeClass('error');
      hasError = false;
      highlightError = function(selector, message, fn) {
        var invalid;
        invalid = form.find(selector).filter(fn);
        if (invalid.length) {
          if (!hasError) {
            errors.html('');
            invalid.focus();
          }
          errors.append(("<li>" + (message) + "</li>"));
          invalid.addClass('error');
          return (hasError = true);
        }
      };
      highlightError('input.email', 'Invalid email address', function() {
        var val;
        val = $(this).val();
        return val && !/^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
      });
      highlightError('input[name=name]', 'Name is required', function() {
        return !$(this).val();
      });
      highlightError('input#github', 'GitHub username is required', function() {
        return !$(this).val();
      });
      highlightError('input.email:first', 'Email is required', function() {
        return !$(this).val();
      });
      highlightError('input[type=password]:visible', 'Password required', function() {
        return !$(this).val();
      });
      highlightError('input.url', 'Invalid link', function() {
        var val;
        val = $(this).val();
        return val && val !== this.defaultValue && !/^https?:\/\/.*\./.test(val);
      });
      hasError ? errors.slideDown('fast') : $('input.url').each(function() {
        if (this.value === this.defaultValue) {
          return (this.value = '');
        }
      });
      return !hasError;
    });
    $('.body.index .countdown').each(function() {
      var countdown, start, tick;
      start = Date.UTC(2010, 8, 2, 23, 59, 59);
      countdown = $('#date .countdown');
      tick = function() {
        var days, diff, hours, minutes, secs;
        diff = (start - new Date()) / 1000;
        if (diff <= 0) {
          return countdown.html("TIME'S UP!");
        } else {
          days = Math.floor(diff % 604800 / 86400);
          hours = Math.floor(diff % 86400 / 3600);
          minutes = Math.floor(diff % 3600 / 60);
          secs = Math.floor(diff % 60);
          countdown.html((days > 0 ? days + ' day ' : '') + (hours > 0 ? hours + ' hours ' : '') + (minutes > 0 || hours > 0 ? minutes + ' minutes ' : minutes) + secs + ' seconds' + ' left');
          return setTimeout(tick, 1000);
        }
      };
      return tick();
    });
    $('.body.index time').live('hover', function(e) {
      var $this, _a, d, dt, h, i, m, ms, s, y;
      if (e.type === 'mouseout') {
        return $('.localtime').remove();
      }
      $this = $(this);
      _a = $this.attr('datetime').split(/[-:TZ]/);
      y = _a[0];
      m = _a[1];
      d = _a[2];
      h = _a[3];
      i = _a[4];
      s = _a[5];
      ms = Date.UTC(y, m - 1, d, h, i, s);
      dt = new Date(ms);
      return $('<div class="localtime blue">').css({
        left: e.pageX,
        top: $(this).position().top + 25
      }).html(("" + (dt.strftime('%a %b %d, %I:%M%P %Z').replace(/\b0/, '')))).appendTo(document.body);
    });
    $('.judge img').each(function() {
      var r;
      r = 'rotate(' + new String(Math.random() * 6 - 3) + 'deg)';
      return $(this).css('-webkit-transform', r).css('-moz-transform', r);
    });
    $('.application .deployed .more a').click(function() {
      $('.deploy').slideToggle('fast');
      return false;
    });
    Stars = {
      hoverAt: null,
      value: function(elem) {
        return elem.attr('data-value');
      },
      input: function(elem) {
        return elem.closest('.stars').prev('input[type=hidden]');
      },
      set: function(elem) {
        var newVal, oldVal;
        newVal = this.value(elem);
        oldVal = this.input(elem).val();
        return this.input(elem).val(newVal === oldVal ? 0 : newVal);
      },
      highlight: function(elem, hover) {
        var score;
        Stars.hoverAt = Stars.hoverAt || +new Date();
        score = parseInt(hover ? this.value(elem) : this.input(elem).val());
        return elem.closest('.stars').children().each(function(i, star) {
          var $star, fill;
          $star = $(star);
          fill = $star.attr('data-value') <= score;
          $star.find('.filled').toggle(fill);
          return $star.find('.empty').toggle(!fill);
        });
      }
    };
    $('#your_vote').delegate('.edit .star', 'hover', function(e) {
      return Stars.highlight($(this), e.type === 'mouseover');
    }).delegate('.edit .star', 'click', function(e) {
      return Stars.set($(this));
    });
    (function() {
      $('.votes time').each(function() {
        var _a, d, h, i, m, ms, s, y;
        _a = $(this).attr('datetime').split(/[-:TZ]/);
        y = _a[0];
        m = _a[1];
        d = _a[2];
        h = _a[3];
        i = _a[4];
        s = _a[5];
        ms = Date.UTC(y, m - 1, d, h, i, s);
        return $(this).text(prettyDate(new Date(ms)));
      });
      return setTimeout(arguments.callee, 10 * 1000);
    })();
    $('.votes .more').each(function() {
      var $more, loadMoreNow, page;
      $more = $(this);
      loadMoreNow = $more.position().top - $(window).height() + 10;
      page = 1;
      return $(window).scroll(function(e) {
        if (loadMoreNow && this.scrollY > loadMoreNow) {
          loadMoreNow = null;
          return $.get(window.location.pathname + ("/votes.js?page=" + (++page)), function(html) {
            var moreVotes;
            moreVotes = $('<div class="page">').html(html);
            $more.remove();
            $('.votes').append(moreVotes);
            if (moreVotes.find('li').length === 51) {
              $('.votes').append($more);
              return (loadMoreNow = $more.position().top - $(window).height() + 10);
            }
          });
        }
      });
    });
    saveDraft = __bind(function(form) {
      var _a;
      if (!((typeof (_a = window.localStorage) !== "undefined" && _a !== null))) {
        return null;
      }
      return (localStorage['draft'] = JSON.stringify(form.serializeArray()));
    }, this);
    $('#your_vote a[href$=draft]').click(function() {
      return saveDraft($(this).closest('form'));
    });
    prependVote = function(data) {
      $('#no_votes').hide();
      return $(data).prependTo('ul.votes').hide().next('li.header').remove().end().slideDown('fast');
    };
    updateVote = function(data) {
      var $newVote, id;
      $newVote = $(data);
      id = $newVote.attr('id');
      $('#' + id).replaceWith($newVote);
      return $newVote;
    };
    showVote = function($form, $vote) {
      $form.find('.show .comment').html($vote.find('.comment').html());
      return $form.find('.vote').removeClass('edit').addClass('show');
    };
    changeForm = function($form, $vote) {
      $form.attr('method', 'PUT').attr('action', window.location.pathname + '/votes/' + $vote.attr('id')).find('input[type=submit]').val('Save');
      return showVote($form, $vote);
    };
    $('#your_vote').submit(function(e) {
      var $errors, $form;
      $form = $(this);
      $errors = $form.find('#errors');
      if ((e.isPropagationStopped())) {
        return false;
      }
      $('<input type="hidden" name="hoverAt">').val(Stars.hoverAt).appendTo($form);
      ajaxForm($form, {
        beforeSend: function() {
          return $form.find(':input').attr('disabled', true);
        },
        success: function(data) {
          var $vote;
          $form.find(':input').attr('disabled', false);
          if ($('#your_vote .email_input').length) {
            return window.location.reload();
          } else {
            if ($form.attr('method') === 'POST') {
              $vote = prependVote(data).eq(-1);
              return changeForm($form, $vote);
            } else {
              $vote = updateVote(data);
              return showVote($form, $vote);
            }
          }
        },
        error: function(xhr) {
          var email, errors, path;
          $form.find(':input').attr('disabled', false);
          if (xhr.status === 403) {
            saveDraft($form);
            email = encodeURIComponent($form.find('#email').val());
            path = encodeURIComponent(window.location.pathname + '#save');
            return (window.location = ("/login?email=" + (email) + "&return_to=" + (path)));
          } else {
            errors = JSON.parse(xhr.responseText);
            return $errors.html(_.map(errors, function(error) {
              return "<li>" + (error) + "</li>";
            }).join("\n")).slideDown('fast');
          }
        }
      });
      return false;
    });
    $('#your_vote').delegate('.vote.show .show a.change', 'click', function() {
      $(this).closest('.vote').removeClass('show').addClass('edit');
      return false;
    });
    $('#your_vote').delegate('label .tip', 'hover', function(e) {
      var stars, tips;
      tips = $('#your_vote').find('.tips div');
      stars = $('#your_vote').find('.stars');
      if (e.type === 'mouseout') {
        tips.hide();
        return stars.show();
      } else {
        stars.hide();
        return tips.filter('.' + $(this).parent().attr('for')).show();
      }
    });
    $('.teams-show #your_vote').each(function() {
      var _a, _b, _c, _d, draft, el, hash;
      if (!((typeof (_a = window.localStorage) !== "undefined" && _a !== null))) {
        return null;
      }
      hash = window.location.hash;
      draft = window.localStorage == undefined ? undefined : window.localStorage.draft;
      try {
        if (!(draft && (hash === '#save' || hash === '#draft'))) {
          return null;
        }
        _c = JSON.parse(draft);
        for (_b = 0, _d = _c.length; _b < _d; _b++) {
          el = _c[_b];
          $(this[el.name]).val(el.value);
        }
        if (window.location.hash === '#save') {
          Stars.hoverAt = Stars.hoverAt || +new Date();
          return $('#your_vote').submit();
        }
      } finally {
        localStorage.draft = null;
      }
    });
    $('.votes-new .stars, #your_vote .stars').each(function() {
      return Stars.highlight($(this));
    });
    $('.votes').delegate('a.reply', 'click', function() {
      $.scrollTo($($(this).attr('href')).slideDown('fast'), {
        offset: {
          top: -50
        }
      });
      return false;
    });
    $('.votes').delegate('.reply form', 'submit', function(e) {
      var $errors, $form;
      $form = $(this);
      $errors = $form.find('.errors');
      ajaxForm($form, {
        beforeSend: function() {
          return $form.find(':input').attr('disabled', true);
        },
        complete: function() {
          return $form.find(':input').attr('disabled', false);
        },
        success: function(data) {
          return $form.slideUp('fast').prev('ul.replies').append($(data)).end().find('textarea').val('');
        },
        error: function(xhr) {
          var errors;
          errors = JSON.parse(xhr.responseText);
          return $errors.html(_.map(errors, function(error) {
            return "<li>" + (error) + "</li>";
          }).join("\n")).slideDown('fast');
        }
      });
      return false;
    });
    $('.body.people-confirm form.resend a').click(function() {
      return $(this).closest('form').submit();
    });
    false;
    return $('.teams-index .sort').each(function() {
      $(window).hashchange(function() {
        var dimension, sorted;
        if (!(location.hash)) {
          return null;
        }
        $('.sort a').removeClass('current').filter('a[href=' + location.hash + ']').addClass('current');
        dimension = location.hash.substring(1);
        sorted = _.sortBy($('ul.teams li'), function(t) {
          var score;
          t = $('.application', t);
          score = t.attr('data-' + dimension);
          t.find('.score').find('h2').text(parseFloat(score).toFixed(2)).end().find('h6').text(dimension.replace(/ness$/, ''));
          return -score;
        });
        return $('ul.teams').html(sorted);
      });
      return $(window).hashchange();
    });
  });
})();
