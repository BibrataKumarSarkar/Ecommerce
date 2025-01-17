/**
 * This file is merged via wp-content/themes/ifactory/gulpfile.js
 * (The file has been customized so; Search "ifactory.js" in the file)
 */

"use strict";

var iFactory;

(function($) {

    iFactory = {
        /**
         * Display Element after applying data sent via AJAX with TEMPLATE Tag
         * @param template
         * @param options
         */
        renderTemplate: function(template, options) {

            // Not to process if template is getting rendered
            if (template.hasClass('if-rendering')) return;

            // https://developer.wordpress.org/reference/classes/wp_query/parse_query/
            // https://www.advancedcustomfields.com/resources/query-posts-custom-fields/
            var paramsAllowed = [
                'numberposts',
                'post_type',
                'category',
                'tag__in',
                'tag_slug__in',
                'offset',
                'order',
                'orderby',
                'paged',
                'tax_query',
                'meta_key',
                'meta_value',
                'meta_query',
            ];

            // Enable templates to pass options via iFactory.run()
            if (typeof options === 'undefined') {
                template.trigger('ifRenderTemplateOptions', [template]);
                options = template.data('renderTemplateOptions');
            }

            options = $.extend({
                action: 'get_posts',
                paramsKeep: {}
            }, options);

            // Save default values in template
            if (!template.hasClass('if-has-default')) {
                template.addClass('if-has-default');
                paramsAllowed.map(function(key) {
                    var keyHtml = key.replace(/_/g, '-');
                    if (!template.data(keyHtml + '_default')) {
                        template.data(keyHtml + '_default', template.data(keyHtml));
                    }
                });
                // Forcefully set the default because this value may not be 0
                // depending on how the page initially shows Posts
                template.data('offset_default', 0);
            }

            if (options.empty) {
                delete options.empty;
                // Delete all the Posts displayed
                $('#' + template.data('container')).empty();
                // Initialize the values in template
                template.removeClass('if-loaded-all');
                if (!options.paramsKeep.numberposts) options.paramsKeep.numberposts = 1;
                if (!options.paramsKeep.orderby) options.paramsKeep.orderby = 1;
                if (!options.paramsKeep.order) options.paramsKeep.order = 1;
                paramsAllowed.map(function(key) {
                    var keyHtml = key.replace(/_/g, '-');
                    if (Object.keys(options.paramsKeep).indexOf(key) === -1) template.data(keyHtml, null);
                });
                template.data('offset', 0);
            }
            delete options.paramsKeep;

            // Use default values if specified
            if (options.default) {
                delete options.default;
                paramsAllowed.map(function(key) {
                    var keyHtml = key.replace(/_/g, '-');
                    if (template.data(keyHtml + '_default')) {
                        template.data(keyHtml, template.data(keyHtml + '_default'));
                    }
                });
            }

            // Not to process if Number of Posts is reached to the total
            if (template.hasClass('if-loaded-all')) return;

            template.addClass('if-rendering');
            template.trigger('ifBeforeSendRequest');

            paramsAllowed.map(function(key) {

                var keyHtml = key.replace(/_/g, '-');
                var value;

                // Prefer the value in "options" and overwrite the value in template
                if (options[key]) {
                    // Overwriting the value in template
                    template.data(keyHtml, options[key]);
                }
                // Apply the setting in template
                value = template.data(keyHtml);
                if (value) options[key] = value;
            });

            // Debug for Project Category/Tag
            // options.tax_query = [
            //   {
            //     taxonomy: 'project_tag',
            //     field: 'slug',
            //     terms: ['digital-strategy']
            //   }
            // ];
            // options.tax_query = [
            //   {
            //     taxonomy: 'project_category',
            //     field: 'slug',
            //     terms: ['government']
            //   }
            // ];

            if (typeof ifactory_js === 'undefined') {
                console.log('ifactory_js is not defined!');
                ifactory_js = {};
            }
            $.get(
                // "ifactory_js" is defined at functions.php::theme_enqueue_styles()
                ifactory_js.ajax_url,
                options,
                function(response) {
                    var cb = template.data('callback');
                    if (!cb) {
                        cb = 'renderDefault';
                        //console.error('callback is empty for', template);
                        //return;
                    }
                    //if ( ! iFactory[cb]) {
                    //  console.error('callback "' + cb + '" is not defined for', template);
                    //  return;
                    //}
                    //if (iFactory.debug) console.warn('response', response);
                    iFactory[cb](template, response);
                },
                'json'
            );
        },
        run: function() {

            var target = $('template.ifactory-get-posts');

            if (target.length > 0) {

                target.map(function(key, t) {
                    // Load Posts only if mentioned so
                    if ($(t).data('load-on-display')) iFactory.renderTemplate($(t));
                });

                window.addEventListener('scroll', function() {

                    var topElement = $(window);
                    var positionBottom = topElement.scrollTop() + topElement.height();
                    // @todo Enable to pass this per element
                    var offset = 0;

                    target.map(function(key, t) {

                        var element = '#' + $(t).data('element-bottom');
                        if ($(element).length > 0) {

                            // console.log('check', positionBottom, ($(element).offset().top + offset) <= positionBottom);
                            if (($(element).offset().top + offset) <= positionBottom) {
                                if (!getParameterByName('search')) {
                                    jQuery('.searchhistory').remove();
                                    jQuery('#ifcasestudyinput').val('');
                                    iFactory.renderTemplate($(t));
                                }

                            }
                        }
                    });

                }, false);
            }
        },
        /**
         * Rendering Functions
         */
        getPostValue: function(post, field) {
            var actualField = post[field];
            var actualKey;
            var warned = false;
            if (field.match(/^data_/)) {
                actualKey = field.replace(/^data_/, '');
                if (post.data[actualKey]) {
                    actualField = post.data[actualKey].value;
                } else {
                    if (iFactory.debug) {
                        warned = true;
                        console.warn('post.data[' + actualKey + '] not found', post);
                    }
                    actualField = '';
                }
            }
            // Enable to use nested value (e.g. "featuredImages.full.0")
            var matches = field.split('.');
            if (matches.length > 1) {
                var tmpF = post[matches[0]];
                for (var i = 1; i < matches.length; i++) tmpF = tmpF[matches[i]];
                actualField = tmpF;
            }
            if (!actualField && !warned && iFactory.debug) console.warn('post.' + field + ' not found', post);
            return actualField;
        },
        render: function($el, post) {
            var field;
            // Enable to set a attribute dynamically
            // At the moment, this does not let you set multiple attributes (e.g. "class" and "href")
            var attr = $el.data('attr');
            field = $el.data('attr-field');
            // Set Attribute
            if (attr && field) $el.attr(attr, iFactory.getPostValue(post, field));
            // Set HTML with Post Field
            field = $el.data('html-field');
            if (field) $el.html(iFactory.getPostValue(post, field));
            // Enable to apply custom rendering logic
            var methodName = $el.data('method');
            if (methodName && iFactory[methodName]) iFactory[methodName](post, $el);
        },
        //
        // This is default rendering logic and is for "Our Work".
        // In case you need to render in a different way,
        // I leave a note about how we can do that as follows:
        //
        //   - Copy the code renderDefault() in your JS File
        //
        //   - Amend the method name from "renderDefault" (No need to start with "render")
        //
        //   - Add the method to the variable "iFactory" like this:
        //
        //     if ( ! iFactory.myRender) {
        //       iFactory.myRender = function (template, response) {
        //         // Your own rendering logic
        //       }
        //     }
        //
        //   - Mention the method name at "data-callback" in TEMPLATE Tag
        //     ("myRender" in the example above)
        //
        //   - Ask Hiro if that did not work
        //
        // If you need to refer the data not in the variable "response", you must amend the file:
        // wp-content/themes/ifactory/functions.php::ifactory_ajax_get_posts()
        // as to include the data for "$data" in above file.
        //
        renderDefault: function(template, response) {

            if (!response.posts) {
                template.trigger('ifRenderCompleted');
                return;
            }

            // This means there is no more Posts to load
            if (response.posts.length === 0) {
                // Enable to stop loading after showing all the Posts
                template.addClass('if-loaded-all');
                template.removeClass('if-rendering');
                template.trigger('ifRenderCompleted');
                return;
            }

            template.trigger('ifBeforeRender', response);

            var container = $('#' + template.data('container'));
            var posts = response.posts;

            // Show Posts
            Object.keys(posts).map(function(key) {

                var post = posts[key];

                // Enable to select the template dynamically.
                template.trigger('ifAlterTemplate', [response, post, template]);
                var element = $(template.data('template') ? template.data('template').html() : template.html());

                // Show Progress Icon if specified
                if (template.data('progress-icon')) {
                    var progress = $($(template.data('progress-icon')).html());
                    element.prepend(progress);
                }

                element.attr('id', 'post-' + post.id);

                // Enable to refer if any Post is still being rendered
                element.addClass('if-rendering');

                container.append(element);

                // Enable to do something at this timing
                template.trigger('ifBeforeRenderPost', [response, post, element]);

                //post.title
                //post.body
                //post.category

                // Set Attribute and HTML according to "data" attributes
                element.find('[data-attr], [data-html-field]').map(function(key, el) {
                    iFactory.render($(this), post);
                });

                // Extra render logic
                template.trigger('ifRenderExtra', [response, post, element]);

                // Delay to complete the rendering logic for Fadein Effect etc
                // (Not sure if this is necessary, but I thought this might be useful in some cases)
                setTimeout(function() {

                    // Remove Progress Icon if specified
                    if (template.data('progress-icon')) element.find('.progress-icon').remove();

                    // Enable to do something at this timing (e.g. Applying jQuery Plugin etc)
                    template.trigger('ifRenderPostCompleted', [response, post, element]);

                    // Show the Post with Fadein Effect
                    element.find('.fade').addClass('show');

                    // Enable to refer if any Post is still being rendered
                    element.removeClass('if-rendering');

                    // Post rendering logic
                    if ($('#' + template.data('container')).find('.if-rendering').length === 0) {

                        // Update "data-offset" in "template" to enable to load more
                        var offset = parseInt(template.data('offset'));
                        //var numberposts = parseInt(template.data('numberposts')) || 3;
                        var numberposts = 10;
                        template.data('offset', offset + numberposts);

                        // Enable to render again
                        template.removeClass('if-rendering');
                        template.trigger('ifRenderCompleted');
                    }
                }, template.data('delay') || 500);
            });
        }
    };
})(jQuery);